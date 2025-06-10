using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Models;
using LpAutomobile.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace LpAutomobile.Pages.Vehicules
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        // C'est cette propriété que Razor attend dans le .cshtml
        public List<Vehicule> Vehicules { get; set; } = new();

        [BindProperty(SupportsGet = true)]
        public string? Marque { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? PrixMin { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? PrixMax { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? KmMax { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? KmMin { get; set; }

        [BindProperty(SupportsGet = true)]
        public string? Modele { get; set; }
        [BindProperty(SupportsGet = true)] public string? Energie { get; set; }
        [BindProperty(SupportsGet = true)] public string? Transmission { get; set; }

        [BindProperty(SupportsGet = true)]
        public int Page { get; set; } = 1;
        public int TotalPages { get; set; }

        // Affichage de la liste des vehicule present en bdd
        public async Task OnGetAsync()
        {
            var query = _context.Vehicules.AsQueryable();

            if (!string.IsNullOrWhiteSpace(Marque))
                query = query.Where(v => v.Marque.ToLower().Contains(Marque.ToLower()));

            // ✅ Prix compris entre PrixMin et PrixMax
            if (PrixMin.HasValue)
                query = query.Where(v => v.Prix >= PrixMin.Value);

            if (PrixMax.HasValue)
                query = query.Where(v => v.Prix <= PrixMax.Value);

            // ✅ Kilométrage compris entre KmMin et KmMax
            if (KmMin.HasValue)
                query = query.Where(v => v.Kilometrage >= KmMin.Value);

            if (KmMax.HasValue)
                query = query.Where(v => v.Kilometrage <= KmMax.Value);

            if (!string.IsNullOrWhiteSpace(Energie))
                query = query.Where(v => v.Energie == Energie);

            if (!string.IsNullOrWhiteSpace(Transmission))
                query = query.Where(v => v.Transmission == Transmission);

            if (!string.IsNullOrWhiteSpace(Modele))
                query = query.Where(v => v.Modele.ToLower().Contains(Modele.ToLower()));

            int pageSize = 10;
            int totalCount = await query.CountAsync();
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            Vehicules = await query
                .Include(v => v.Photos) // ⬅️ Récupère les photos liées
                .OrderBy(v => v.Id)
                .Skip((Page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        [BindProperty]
        public int VehiculeId { get; set; }

        [TempData]
        public string? FeedbackMessage { get; set; }

        // Delete vehicule
        public async Task<IActionResult> OnPostAsync()
        {
            var vehicule = await _context.Vehicules.FindAsync(VehiculeId);
            if (vehicule == null)
            {
                FeedbackMessage = "Le véhicule n'a pas été trouvé.";
                return RedirectToPage();
            }

            var photos = _context.Photos.Where(p => p.VehiculeId == VehiculeId);
            _context.Photos.RemoveRange(photos);
            _context.Vehicules.Remove(vehicule);
            await _context.SaveChangesAsync();

            FeedbackMessage = $"Le véhicule {vehicule.Marque} {vehicule.Modele} a été supprimé avec succès.";
            return RedirectToPage();
        }
    }
}
