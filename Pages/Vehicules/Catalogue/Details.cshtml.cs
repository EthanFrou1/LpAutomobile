using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Data;
using LpAutomobile.Models;
using LpAutomobile.Services;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Pages.Catalogue;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public DetailsModel(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public List<AvisGoogle> Avis { get; set; } = new();
    public Vehicule? Vehicule { get; set; }

    [TempData]
    public string? ContactSuccess { get; set; }

    [TempData]
    public string? ContactError { get; set; }

    public async Task<IActionResult> OnGetAsync(int id)
    {
        Vehicule = await _context.Vehicules
            .Include(v => v.Equipements)
            .Include(v => v.Photos)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (Vehicule == null)
        {
            return NotFound();
        }

        // Charger les avis Google
        Avis = await _context.AvisGoogle
            .OrderByDescending(a => a.DateAvis)
            .Take(6)
            .ToListAsync();

        return Page();
    }

    public async Task<IActionResult> OnPostInterestAsync(
       int vehiculeId,
       string nom,
       string email,
       string telephone,
       string motivation,
       string? message = null,
       bool recevoirEmailChecked = false,
       bool recevoirAppelChecked = false)
    {
        try
        {
            var vehicule = await _context.Vehicules.FindAsync(vehiculeId);
            if (vehicule == null)
            {
                ContactError = "Véhicule introuvable.";
                return RedirectToPage(new { id = vehiculeId });
            }

            // Créer le modèle simplifié
            var model = new DemandeInfoVehiculeModel
            {
                Nom = nom,
                Email = email,
                Telephone = telephone,
                Motivation = motivation,
                Message = message ?? string.Empty,
                RecevoirEmail = recevoirEmailChecked,
                RecevoirAppel = recevoirAppelChecked,
                VehiculeId = vehicule.Id,
                VehiculeInfo = $"{vehicule.Marque} {vehicule.Modele}",
                Prix = vehicule.Prix,
                Annee = vehicule.Annee,
                Kilometrage = vehicule.Kilometrage
            };

            // Utiliser ton EmailService existant
            var success = await _emailService.EnvoyerDemandeInfoVehiculeAsync(model);

            if (success)
            {
                ContactSuccess = $"Votre demande d'informations pour le {vehicule.Marque} {vehicule.Modele} a été envoyée avec succès !";
            }
            else
            {
                ContactError = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
            }
        }
        catch (Exception ex)
        {
            ContactError = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
            // Log de l'erreur si tu as un système de logs
            Console.WriteLine($"Erreur envoi email: {ex.Message}");
        }

        return RedirectToPage(new { id = vehiculeId });
    }

    // =================================
    // HANDLER POUR "FAIRE UNE OFFRE"
    // =================================
    public async Task<IActionResult> OnPostOffreAsync(
        int vehiculeId,
        string nom,
        string email,
        string telephone,
        int montant_offre,
        string mode_paiement,
        DateTime date_achat_souhaitee, // ✅ CHANGEMENT : DateTime au lieu de string
        string? reprise_marque = null,
        int? reprise_annee = null,
        int? reprise_km = null,
        string? commentaires = null)
    {
        try
        {
            var vehicule = await _context.Vehicules.FindAsync(vehiculeId);
            if (vehicule == null)
            {
                ContactError = "Véhicule introuvable.";
                return RedirectToPage(new { id = vehiculeId });
            }

            // Créer le modèle pour offre
            var model = new OffreVehiculeModel
            {
                Nom = nom,
                Email = email,
                Telephone = telephone,
                MontantOffre = montant_offre,
                ModePaiement = mode_paiement,
                DateAchatSouhaitee = date_achat_souhaitee, // ✅ NOUVEAU CHAMP
                RepriseMarque = reprise_marque,
                RepriseAnnee = reprise_annee,
                RepriseKm = reprise_km,
                Commentaires = commentaires,
                VehiculeId = vehicule.Id,
                VehiculeInfo = $"{vehicule.Marque} {vehicule.Modele}",
                Prix = vehicule.Prix,
                Annee = vehicule.Annee,
                Kilometrage = vehicule.Kilometrage
            };

            var success = await _emailService.EnvoyerOffreVehiculeAsync(model);

            if (success)
            {
                ContactSuccess = $"Votre offre de {montant_offre:C0} pour le {vehicule.Marque} {vehicule.Modele} a été transmise !";
            }
            else
            {
                ContactError = "Une erreur est survenue lors de l'envoi.";
            }
        }
        catch (Exception ex)
        {
            ContactError = "Une erreur est survenue lors de l'envoi.";
            Console.WriteLine($"Erreur envoi offre: {ex.Message}");
        }

        return RedirectToPage(new { id = vehiculeId });
    }

    // =================================
    // HANDLER POUR "RÉSERVER UN ESSAI"
    // =================================
    public async Task<IActionResult> OnPostEssaiAsync(
        int vehiculeId,
        string nom,
        string email,
        string telephone,
        DateTime date_souhaitee,
        string creneau,
        int duree,
        string numero_permis,
        string anciennete_permis,
        bool avecConseillerChecked = false,
        string? demandes_speciales = null)
    {
        try
        {
            var vehicule = await _context.Vehicules.FindAsync(vehiculeId);
            if (vehicule == null)
            {
                ContactError = "Véhicule introuvable.";
                return RedirectToPage(new { id = vehiculeId });
            }

            // Vérification de la date
            if (date_souhaitee.Date < DateTime.Now.Date)
            {
                ContactError = "La date d'essai doit être dans le futur.";
                return RedirectToPage(new { id = vehiculeId });
            }

            var model = new ReservationEssaiModel
            {
                Nom = nom,
                Email = email,
                Telephone = telephone,
                DateSouhaitee = date_souhaitee,
                Creneau = creneau,
                Duree = duree,
                NumeroPermis = numero_permis,
                AnciennetePermis = anciennete_permis,
                AvecConseiller = avecConseillerChecked,
                DemandesSpeciales = demandes_speciales,
                VehiculeId = vehicule.Id,
                VehiculeInfo = $"{vehicule.Marque} {vehicule.Modele}",
                Prix = vehicule.Prix,
                Annee = vehicule.Annee,
                Kilometrage = vehicule.Kilometrage
            };

            var success = await _emailService.EnvoyerReservationEssaiAsync(model);

            if (success)
            {
                ContactSuccess = $"Votre demande d'essai pour le {vehicule.Marque} {vehicule.Modele} le {date_souhaitee:dd/MM/yyyy} a été enregistrée !";
            }
            else
            {
                ContactError = "Une erreur est survenue lors de l'envoi.";
            }
        }
        catch (Exception ex)
        {
            ContactError = "Une erreur est survenue lors de l'envoi.";
            Console.WriteLine($"Erreur envoi essai: {ex.Message}");
        }

        return RedirectToPage(new { id = vehiculeId });
    }
}
