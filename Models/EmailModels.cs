using System.ComponentModel.DataAnnotations;

namespace LpAutomobile.Models
{
    // Modèle pour la réponse de l'API
    public class EmailResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }

    // Modèle pour le contact général
    public class ContactGeneralModel
    {
        [Required(ErrorMessage = "Le nom est obligatoire")]
        [MinLength(2, ErrorMessage = "Le nom doit contenir au moins 2 caractères")]
        public string Nom { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le message est obligatoire")]
        [MinLength(10, ErrorMessage = "Le message doit contenir au moins 10 caractères")]
        public string Message { get; set; } = string.Empty;

        // ✅ Propriétés supplémentaires pour tes templates
        public string? Telephone { get; set; }
        public string? Sujet { get; set; }
    }

    public class DemandeInfoVehiculeModel
    {
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Motivation { get; set; } = string.Empty;
        public string? Message { get; set; }
        public bool RecevoirEmail { get; set; } = true;
        public bool RecevoirAppel { get; set; } = false;

        // Infos véhicule
        public int VehiculeId { get; set; }
        public string VehiculeInfo { get; set; } = string.Empty; // "Volkswagen Polo"
        public decimal Prix { get; set; }
        public int Annee { get; set; }
        public int Kilometrage { get; set; }
    }

    public class OffreVehiculeModel
    {
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public int MontantOffre { get; set; }
        public string ModePaiement { get; set; } = string.Empty;
        public DateTime DateAchatSouhaitee { get; set; }
        public string? Commentaires { get; set; }

        // Reprise véhicule (optionnel)
        public string? RepriseMarque { get; set; }
        public int? RepriseAnnee { get; set; }
        public int? RepriseKm { get; set; }

        // Infos véhicule
        public int VehiculeId { get; set; }
        public string VehiculeInfo { get; set; } = string.Empty;
        public decimal Prix { get; set; }
        public int Annee { get; set; }
        public int Kilometrage { get; set; }

        // Calculs automatiques
        public decimal Ecart => Prix - MontantOffre;
        public decimal PourcentageEcart => Math.Round((Ecart / Prix) * 100, 1);

        public string DateAchatFormatee => DateAchatSouhaitee.ToString("dd/MM/yyyy");
    }
    public class ReservationEssaiModel
    {
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public DateTime DateSouhaitee { get; set; }
        public string Creneau { get; set; } = string.Empty;
        public int Duree { get; set; } = 60; // minutes
        public string NumeroPermis { get; set; } = string.Empty;
        public string AnciennetePermis { get; set; } = string.Empty;
        public bool AvecConseiller { get; set; } = false;
        public string? DemandesSpeciales { get; set; }

        // Infos véhicule
        public int VehiculeId { get; set; }
        public string VehiculeInfo { get; set; } = string.Empty;
        public decimal Prix { get; set; }
        public int Annee { get; set; }
        public int Kilometrage { get; set; }

        // Formatage automatique
        public string DateFormatee => DateSouhaitee.ToString("dddd dd MMMM yyyy");
        public string DureeFormatee => Duree switch
        {
            30 => "30 minutes",
            60 => "1 heure",
            120 => "2 heures",
            _ => $"{Duree} minutes"
        };
    }
}