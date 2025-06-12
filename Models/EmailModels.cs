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

    // Modèle pour l'intérêt véhicule
    public class InteretVehiculeModel
    {
        [Required(ErrorMessage = "Le nom est obligatoire")]
        [MinLength(2, ErrorMessage = "Le nom doit contenir au moins 2 caractères")]
        public string Nom { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le véhicule est obligatoire")]
        public int VehiculeId { get; set; }

        public string? Message { get; set; }

        // ✅ Propriétés supplémentaires pour tes templates
        public string? Telephone { get; set; }
        public string TypeDemande { get; set; } = "Intérêt"; // "Intérêt", "Essai", "Offre"
        public decimal? OffrePrix { get; set; } // Pour les offres d'achat

        // Propriétés remplies automatiquement
        public string VehiculeInfo { get; set; } = string.Empty;
        public decimal Prix { get; set; }
    }

    // Modèle pour la demande d'estimation
    public class DemandeEstimationModel
    {
        [Required(ErrorMessage = "Le nom est obligatoire")]
        [MinLength(2, ErrorMessage = "Le nom doit contenir au moins 2 caractères")]
        public string Nom { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le téléphone est obligatoire")]
        [Phone(ErrorMessage = "Format de téléphone invalide")]
        public string Telephone { get; set; } = string.Empty;

        [Required(ErrorMessage = "La marque est obligatoire")]
        public string Marque { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le modèle est obligatoire")]
        public string Modele { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'année est obligatoire")]
        [Range(1900, 2030, ErrorMessage = "L'année doit être entre 1900 et 2030")]
        public int Annee { get; set; }

        [Required(ErrorMessage = "Le kilométrage est obligatoire")]
        [Range(0, 1000000, ErrorMessage = "Le kilométrage doit être entre 0 et 1,000,000 km")]
        public int Kilometrage { get; set; }

        public string? Message { get; set; }

        // ✅ Propriétés supplémentaires pour tes templates
        public string? Energie { get; set; }
        public string? Transmission { get; set; }
        public string? EtatGeneral { get; set; }
        public bool EstEnPanne { get; set; }
        public string? DescriptionPanne { get; set; }
    }
}