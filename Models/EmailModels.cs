using System.ComponentModel.DataAnnotations;

namespace LpAutomobile.Models
{
    // Modèle de base pour tous les emails
    public abstract class BaseEmailModel
    {
        [Required(ErrorMessage = "Le nom est obligatoire")]
        [StringLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères")]
        public string Nom { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Format de téléphone invalide")]
        public string? Telephone { get; set; }

        [Required(ErrorMessage = "Le message est obligatoire")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Le message doit contenir entre 10 et 1000 caractères")]
        public string Message { get; set; } = string.Empty;
    }

    // Contact général
    public class ContactGeneralModel : BaseEmailModel
    {
        public string? Sujet { get; set; }
    }

    // Intérêt pour un véhicule spécifique
    public class InteretVehiculeModel : BaseEmailModel
    {
        [Required]
        public int VehiculeId { get; set; }

        public string VehiculeInfo { get; set; } = string.Empty; // "Peugeot 308 - 2020"
        public decimal Prix { get; set; }
        public string TypeDemande { get; set; } = "Intérêt"; // "Intérêt", "Essai", "Offre"
        public decimal? OffrePrix { get; set; } // Si c'est une offre
    }

    // Demande d'estimation/reprise
    public class DemandeEstimationModel : BaseEmailModel
    {
        [Required(ErrorMessage = "La marque est obligatoire")]
        public string Marque { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le modèle est obligatoire")]
        public string Modele { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'année est obligatoire")]
        [Range(1990, 2025, ErrorMessage = "L'année doit être entre 1990 et 2025")]
        public int Annee { get; set; }

        [Required(ErrorMessage = "Le kilométrage est obligatoire")]
        [Range(0, 500000, ErrorMessage = "Le kilométrage doit être entre 0 et 500,000 km")]
        public int Kilometrage { get; set; }

        public string? Energie { get; set; }
        public string? Transmission { get; set; }
        public string? EtatGeneral { get; set; }
        public bool EstEnPanne { get; set; }
        public string? DescriptionPanne { get; set; }
    }

    // Réponse après envoi
    public class EmailResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}