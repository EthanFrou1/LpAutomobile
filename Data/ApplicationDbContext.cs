using Microsoft.EntityFrameworkCore;
using LpAutomobile.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LpAutomobile.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Vehicule> Vehicules { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Equipement> Equipements { get; set; }
        public DbSet<AvisGoogle> AvisGoogle { get; set; }

    }
}
