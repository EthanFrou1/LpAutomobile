using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Data;
using LpAutomobile.Models;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Pages.Catalogue
{
    public class DetailsModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public DetailsModel(ApplicationDbContext context)
        {
            _context = context;
        }
        public List<AvisGoogle> Avis { get; set; } = new();

        public Vehicule? Vehicule { get; set; }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            // ✅ Plus besoin de vérifier si id est null car le routing garantit qu'il existe

            Vehicule = await _context.Vehicules
                .Include(v => v.Equipements)
                .Include(v => v.Photos)
                .FirstOrDefaultAsync(v => v.Id == id); // ✅ Utiliser FirstOrDefaultAsync pour async

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

        // ✅ AJOUTER LA MÉTHODE POUR LE FORMULAIRE DE CONTACT
        public async Task<IActionResult> OnPostContactAsync(string nom, string email, string message)
        {
            // Logique pour traiter le contact (optionnel pour l'instant)
            // Tu peux ajouter ici l'envoi d'email, sauvegarde en BDD, etc.

            return RedirectToPage(); // Rediriger vers la même page après soumission
        }
    }
}
