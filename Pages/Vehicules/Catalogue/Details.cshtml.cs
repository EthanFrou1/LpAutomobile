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

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
                return NotFound();

            Vehicule = _context.Vehicules
                .Include(v => v.Equipements)
                .Include(v => v.Photos)
                .FirstOrDefault(v => v.Id == id);


            Avis = await _context.AvisGoogle
                 .OrderByDescending(a => a.DateAvis)
                 .Take(6) // par exemple 6 derniers
                 .ToListAsync();


            if (Vehicule == null)
                return NotFound();

            return Page();
        }
    }
}
