using LpAutomobile.Data;
using LpAutomobile.Models;
using LpAutomobile.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public IndexModel(ILogger<IndexModel> logger, ApplicationDbContext context, IEmailService emailService)
    {
        _logger = logger;
        _context = context;
        _emailService = emailService;
    }

    public List<AvisGoogle> Avis { get; set; } = new();

    [BindProperty]
    public ContactGeneralModel Contact { get; set; } = new();

    [TempData]
    public string? Message { get; set; }

    [TempData]
    public string? StatusType { get; set; } // "success" ou "error"

    public async Task OnGetAsync()
    {
        Avis = await _context.AvisGoogle
             .OrderByDescending(a => a.DateAvis)
             .Take(6)
             .ToListAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Détecter si c'est un appel AJAX
        bool isAjax = Request.Headers.ContainsKey("X-Requested-With") ||
                      Request.Headers["Accept"].ToString().Contains("application/json");

        if (!ModelState.IsValid)
        {
            if (isAjax)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Veuillez corriger les erreurs dans le formulaire."
                });
            }

            // Comportement normal pour les soumissions classiques
            Avis = await _context.AvisGoogle
                .OrderByDescending(a => a.DateAvis)
                .Take(6)
                .ToListAsync();

            StatusType = "error";
            Message = "Veuillez corriger les erreurs dans le formulaire.";
            return Page();
        }

        try
        {
            // ✅ Tentative d'envoi d'email
            var success = await _emailService.EnvoyerContactGeneralAsync(Contact);

            if (success)
            {
                // ✅ SUCCÈS - Email envoyé
                _logger.LogInformation($"Email de contact envoyé avec succès pour {Contact.Nom} ({Contact.Email})");

                if (isAjax)
                {
                    return new JsonResult(new
                    {
                        success = true,
                        message = $"Merci {Contact.Nom} ! Votre message a été envoyé avec succès. Nous vous répondrons rapidement."
                    });
                }

                // Comportement normal
                StatusType = "success";
                Message = $"Merci {Contact.Nom} ! Votre message a été envoyé avec succès.";
                Contact = new ContactGeneralModel();
                return RedirectToPage("/Index");
            }
            else
            {
                // ❌ ÉCHEC - Service d'email a retourné false
                _logger.LogWarning($"Échec de l'envoi d'email pour {Contact.Nom} ({Contact.Email}) - Service retourné false");

                if (isAjax)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "L'envoi de votre message a échoué. Veuillez réessayer ou nous contacter directement au 06 33 16 94 77."
                    });
                }

                // Comportement normal
                StatusType = "error";
                Message = "L'envoi de votre message a échoué. Veuillez réessayer ou nous contacter directement au 06 33 16 94 77.";

                // Recharger les avis pour l'affichage de la page
                Avis = await _context.AvisGoogle
                    .OrderByDescending(a => a.DateAvis)
                    .Take(6)
                    .ToListAsync();

                return Page();
            }
        }
        catch (Exception ex)
        {
            // ❌ EXCEPTION - Erreur technique
            _logger.LogError(ex, "Erreur technique lors de l'envoi du message de contact pour {Nom} ({Email})",
                Contact.Nom, Contact.Email);

            if (isAjax)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Une erreur technique est survenue. Veuillez réessayer dans quelques minutes ou nous contacter directement au 06 33 16 94 77."
                });
            }

            // Comportement normal
            StatusType = "error";
            Message = "Une erreur technique est survenue. Veuillez réessayer dans quelques minutes.";

            // Recharger les avis pour l'affichage de la page
            Avis = await _context.AvisGoogle
                .OrderByDescending(a => a.DateAvis)
                .Take(6)
                .ToListAsync();

            return Page();
        }
    }
}