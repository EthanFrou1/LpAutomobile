namespace LpAutomobile.Models
{
    public class AvisGoogle
    {
        public int Id { get; set; }
        public string Auteur { get; set; } = string.Empty;
        public string Contenu { get; set; } = string.Empty;
        public double Note { get; set; }
        public DateTime DateAvis { get; set; }
        public string AuteurPhotoUrl { get; set; } = string.Empty;
    }
}
