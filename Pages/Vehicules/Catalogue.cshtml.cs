using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using LpAutomobile.Data;
using LpAutomobile.Models;

namespace LpAutomobile.Pages
{
    public class CatalogueModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public CatalogueModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<Vehicule> Vehicules { get; set; } = new List<Vehicule>();

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
        public List<string>? Modeles { get; set; }

        [BindProperty(SupportsGet = true)]
        public List<string>? Energies { get; set; }

        [BindProperty(SupportsGet = true)]
        public List<string>? Transmissions { get; set; }

        [BindProperty(SupportsGet = true)]
        public List<string>? Couleurs { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? AnneeMin { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? AnneeMax { get; set; }

        public int TotalVehicules { get; set; }

        [BindProperty(SupportsGet = true)]
        public int PageNumber { get; set; } = 1;

        public int TotalPages { get; set; }

        // =================================
        // MÉTHODE POUR RÉCUPÉRER LES DONNÉES JSON
        // =================================

        public async Task<JsonResult> OnGetVehiculesJsonAsync()
        {
            try
            {
                var vehicules = await _context.Vehicules
                    .Include(v => v.Photos)
                    .Include(v => v.Equipements)
                    .Select(v => new
                    {
                        id = v.Id,
                        marque = v.Marque,
                        modele = v.Modele,
                        annee = v.Annee,
                        kilometrage = v.Kilometrage,
                        prix = v.Prix,
                        description = v.Description,
                        energie = v.Energie,
                        transmission = v.Transmission,
                        couleur = v.Couleur,
                        prixMensuel = Math.Round(v.Prix / 60, 2),
                        photos = v.Photos.Select(p => new { id = p.Id, url = p.Url }).ToList(),
                        equipements = v.Equipements.Select(e => e.Nom).ToList()
                    })
                    .ToListAsync();

                return new JsonResult(vehicules);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { error = "Erreur lors du chargement des véhicules", message = ex.Message });
            }
        }

        // =================================
        // MÉTHODE ORIGINALE (pour compatibilité)
        // =================================

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

            if (Modeles?.Any() == true)
            {
                // Séparer les modèles par virgule, ignorer les vides, et retirer les doublons
                var allModeles = Modeles
                    .SelectMany(m => m.Split(",", StringSplitOptions.RemoveEmptyEntries))
                    .Select(m => m.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                query = query.Where(v => allModeles.Contains(v.Modele));
            }

            if (Energies?.Any() == true)
            {
                var allEnergies = Energies
                    .SelectMany(e => e.Split(",", StringSplitOptions.RemoveEmptyEntries))
                    .Select(e => e.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                query = query.Where(v => allEnergies.Contains(v.Energie));
            }

            if (Transmissions?.Any() == true)
            {
                var allTransmissions = Transmissions
                    .SelectMany(e => e.Split(",", StringSplitOptions.RemoveEmptyEntries))
                    .Select(e => e.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                query = query.Where(v => allTransmissions.Contains(v.Transmission));
            }

            if (Couleurs?.Any() == true)
            {
                var allCouleurs = Couleurs
                    .SelectMany(c => c.Split(",", StringSplitOptions.RemoveEmptyEntries))
                    .Select(c => c.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                query = query.Where(v => allCouleurs.Contains(v.Couleur));
            }

            if (AnneeMin.HasValue)
                query = query.Where(v => v.Annee >= AnneeMin.Value);

            if (AnneeMax.HasValue)
                query = query.Where(v => v.Annee <= AnneeMax.Value);

            int pageSize = 20; // Augmenté à 20 pour avoir tous tes véhicules
            int totalCount = await query.CountAsync();
            TotalVehicules = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            Vehicules = await query
                .Include(v => v.Photos) // ⬅️ Récupère les photos liées
                .OrderBy(v => v.Id)
                .Skip((PageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}