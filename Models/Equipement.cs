namespace LpAutomobile.Models
{
    public class Equipement
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public int VehiculeId { get; set; } // clé étrangère
    }
}
