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
    public string? StatusMessage { get; set; }

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
        // ✅ La validation se fait automatiquement grâce aux attributs du modèle
        if (!ModelState.IsValid)
        {
            // Recharger les avis si le formulaire n'est pas valide
            Avis = await _context.AvisGoogle
                 .OrderByDescending(a => a.DateAvis)
                 .Take(6)
                 .ToListAsync();

            return Page();
        }

        try
        {
            // ✅ Utiliser directement le modèle Contact
            var success = await _emailService.EnvoyerContactGeneralAsync(Contact);

            if (success)
            {
                StatusMessage = "✅ Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.";
                StatusType = "success";

                // Réinitialiser le formulaire après succès
                Contact = new ContactGeneralModel();
            }
            else
            {
                StatusMessage = "❌ Erreur lors de l'envoi du message. Veuillez réessayer ou nous contacter directement au 06 33 16 94 77.";
                StatusType = "error";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'envoi de l'email de contact");
            StatusMessage = "❌ Une erreur technique s'est produite. Veuillez réessayer plus tard ou nous contacter au 06 33 16 94 77.";
            StatusType = "error";
        }

        // Recharger les avis pour l'affichage
        Avis = await _context.AvisGoogle
             .OrderByDescending(a => a.DateAvis)
             .Take(6)
             .ToListAsync();

        return Page();
    }
}