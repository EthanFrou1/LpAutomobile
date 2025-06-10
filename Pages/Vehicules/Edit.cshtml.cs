using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LpAutomobile.Data;
using LpAutomobile.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LpAutomobile.Pages.Vehicules
{
    public class EditModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public EditModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public Vehicule Vehicule { get; set; }

        [BindProperty]
        public IFormFileCollection? Photos { get; set; }

        [BindProperty]
        public List<int> PhotosToRemove { get; set; } = new();

        [BindProperty]
        public List<string> EquipementsSelectionnes { get; set; } = new();

        public List<Equipement> EquipementsDuVehicule { get; set; } = new();

        [TempData]
        public string? FeedbackMessage { get; set; }

        [TempData]
        public string? FeedbackType { get; set; }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            Vehicule = await _context.Vehicules
                .Include(v => v.Photos)
                .Include(v => v.Equipements)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (Vehicule == null)
                return NotFound();

            EquipementsDuVehicule = Vehicule.Equipements;

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                FeedbackMessage = "Le formulaire n'est pas valide.";
                FeedbackType = "error";
                return Page();
            }

            var vehiculeDb = await _context.Vehicules
                .Include(v => v.Equipements)
                .Include(v => v.Photos)
                .FirstOrDefaultAsync(v => v.Id == Vehicule.Id);

            if (vehiculeDb == null)
            {
                FeedbackMessage = "Véhicule introuvable.";
                FeedbackType = "error";
                return RedirectToPage("Index");
            }

            // Mise à jour des champs
            vehiculeDb.Marque = Vehicule.Marque;
            vehiculeDb.Modele = Vehicule.Modele;
            vehiculeDb.Annee = Vehicule.Annee;
            vehiculeDb.Kilometrage = Vehicule.Kilometrage;
            vehiculeDb.Prix = Vehicule.Prix;
            vehiculeDb.Description = Vehicule.Description;
            vehiculeDb.Energie = Vehicule.Energie;
            vehiculeDb.Transmission = Vehicule.Transmission;
            vehiculeDb.Couleur = Vehicule.Couleur;

            if (EquipementsSelectionnes != null)
            {
                // Nettoyage de la sélection utilisateur
                var selection = EquipementsSelectionnes
                    .Where(e => !string.IsNullOrWhiteSpace(e))
                    .Select(e => e.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                // Liste actuelle en base
                var existants = vehiculeDb.Equipements
                    .Select(e => e.Nom.Trim())
                    .ToList();

                // Détection des ajouts
                var aAjouter = selection
                    .Where(sel => !existants.Any(e => e.Equals(sel, StringComparison.OrdinalIgnoreCase)))
                    .ToList();

                // Détection des suppressions
                var aRetirer = vehiculeDb.Equipements
                    .Where(e => !selection.Any(sel => sel.Equals(e.Nom, StringComparison.OrdinalIgnoreCase)))
                    .ToList();

                // Ajouter les nouveaux
                foreach (var nom in aAjouter)
                {
                    vehiculeDb.Equipements.Add(new Equipement
                    {
                        VehiculeId = vehiculeDb.Id,
                        Nom = nom
                    });
                }

                // Supprimer ceux retirés
                foreach (var e in aRetirer)
                {
                    _context.Equipements.Remove(e);
                }
            }

            // Suppression des photos
            if (PhotosToRemove.Any())
            {
                var photosToDelete = _context.Photos.Where(p => PhotosToRemove.Contains(p.Id)).ToList();
                foreach (var photo in photosToDelete)
                {
                    var path = Path.Combine("wwwroot", photo.Url.TrimStart('/'));
                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);

                    _context.Photos.Remove(photo);
                    if (vehiculeDb.ImagePath == photo.Url)
                        vehiculeDb.ImagePath = "";
                }
            }

            // Ajout de nouvelles photos
            if (Photos != null && Photos.Any())
            {
                var uploadPath = Path.Combine("wwwroot", "uploads", "vehicules");
                Directory.CreateDirectory(uploadPath);
                bool hasMain = !string.IsNullOrEmpty(vehiculeDb.ImagePath);

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
                        VehiculeId = vehiculeDb.Id,
                        Url = url
                    });

                    if (!hasMain)
                    {
                        vehiculeDb.ImagePath = url;
                        hasMain = true;
                    }
                }
            }

            await _context.SaveChangesAsync();

            FeedbackMessage = $"Le véhicule {vehiculeDb.Marque} {vehiculeDb.Modele} a été modifié avec succès.";
            FeedbackType = "success";
            return RedirectToPage("");
        }
    }
}
