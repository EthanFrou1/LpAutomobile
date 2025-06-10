using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Models;
using LpAutomobile.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System;

public class CreateModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public CreateModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public IFormFileCollection Photos { get; set; } = null!;

    [BindProperty]
    public Vehicule Vehicule { get; set; }

    [BindProperty]
    public List<string> EquipementsSelectionnes { get; set; } = new();

    public async Task<IActionResult> OnGetAsync()
    {
        // Tu n'as pas besoin de charger TousLesEquipements si tu les affiches depuis le JSON côté front
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        ModelState.Remove("Vehicule.ImagePath");

        if (!ModelState.IsValid)
            return Page();

        // Étape 1 : Enregistrement du véhicule pour obtenir l'ID
        _context.Vehicules.Add(Vehicule);
        await _context.SaveChangesAsync();

        // Étape 2 : Enregistrer les équipements sélectionnés (propres à ce véhicule)
        if (EquipementsSelectionnes != null && EquipementsSelectionnes.Any())
        {
            var equipementsNettoyes = EquipementsSelectionnes
                .Where(e => !string.IsNullOrWhiteSpace(e))
                .Select(e => e.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            Vehicule.Equipements = equipementsNettoyes
                .Select(nom => new Equipement
                {
                    Nom = nom,
                    VehiculeId = Vehicule.Id
                }).ToList();

            _context.Equipements.AddRange(Vehicule.Equipements);
            await _context.SaveChangesAsync();
        }

        // Étape 3 : Traitement des photos
        if (Photos != null && Photos.Any())
        {
            var uploadPath = Path.Combine("wwwroot", "uploads", "vehicules");
            Directory.CreateDirectory(uploadPath);

            bool isFirst = true;

            foreach (var photo in Photos)
            {
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(photo.FileName)}";
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(stream);
                }

                var url = $"/uploads/vehicules/{fileName}";

                _context.Photos.Add(new Photo
                {
                    VehiculeId = Vehicule.Id,
                    Url = url
                });

                if (isFirst)
                {
                    Vehicule.ImagePath = url;
                    isFirst = false;
                }
            }

            _context.Vehicules.Update(Vehicule);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("/Vehicules/Catalogue");
    }
}