using LpAutomobile.Data;
using LpAutomobile.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    private readonly ApplicationDbContext _context;

    public IndexModel(ILogger<IndexModel> logger, ApplicationDbContext context)
    {
        _logger = logger;

        _context = context;
    }
    public List<AvisGoogle> Avis { get; set; } = new();

    public async Task OnGetAsync()
    {
        Avis = await _context.AvisGoogle
             .OrderByDescending(a => a.DateAvis)
             .Take(6) // par exemple 6 derniers
             .ToListAsync();


        // tu peux aussi charger d'autres données ici
    }
}
