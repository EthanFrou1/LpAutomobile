namespace LpAutomobile.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;

        public int VehiculeId { get; set; }
        public Vehicule Vehicule { get; set; } = null!;
    }
}
