using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Data;
using LpAutomobile.Models;
using System.Threading.Tasks;

namespace LpAutomobile.Pages.Vehicules
{
    public class DeleteModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public DeleteModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Vehicule Vehicule { get; set; }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            Vehicule = await _context.Vehicules.FindAsync(id);
            if (Vehicule == null)
                return NotFound();

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var vehicule = await _context.Vehicules.FindAsync(Vehicule.Id);
            if (vehicule != null)
            {
                _context.Vehicules.Remove(vehicule);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("Index");
        }
    }
}
