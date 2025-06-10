

namespace LpAutomobile.Models
{
    public class Vehicule
    {
        public int Id { get; set; }
        public string Marque { get; set; } = string.Empty;
        public string Modele { get; set; } = string.Empty;
        public int Annee { get; set; }
        public int Kilometrage { get; set; }
        public decimal Prix { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Energie { get; set; } = string.Empty; // Nouveau champ : Electrique, Hybride, etc
        public string Transmission { get; set; } = string.Empty; // Automatique ou Manuelle
        public string Couleur { get; set; } = string.Empty;
        public List<Photo> Photos { get; set; } = new();
        // Affichage simple d'un "prix par mois" approximatif (ex : 60 mois)
        public decimal PrixMensuel => Math.Round(Prix / 60, 2);
        public List<Equipement> Equipements { get; set; } = new();
    }
}