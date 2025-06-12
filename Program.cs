using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using LpAutomobile.Data;
using LpAutomobile.Middleware;
using LpAutomobile.Services; // ← Ajouter

var builder = WebApplication.CreateBuilder(args);

// ===== CONFIGURATION BASE DE DONNÉES =====
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "lpautomobile.db");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// ===== SERVICES =====
builder.Services.AddHostedService<GoogleAvisSyncService>();

// ✅ AJOUTER LE SERVICE D'AUTHENTIFICATION ADMIN
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddRazorPages();

var app = builder.Build();

// ===== MIDDLEWARE =====
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// ✅ AJOUTER LE MIDDLEWARE D'ADMIN AVANT L'AUTORISATION
app.UseMiddleware<AdminAuthMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

// ===== AUTO-MIGRATION EN DÉVELOPPEMENT =====
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated(); // Crée la DB si elle n'existe pas
        
        // Optionnel : Données de test
        if (!context.Vehicules.Any())
        {
            SeedData(context);
        }
    }
}

app.Run();

// ===== DONNÉES DE TEST (optionnel) =====
static void SeedData(ApplicationDbContext context)
{
    var vehiculeTest = new LpAutomobile.Models.Vehicule
    {
        Marque = "Peugeot",
        Modele = "308",
        Annee = 2020,
        Kilometrage = 45000,
        Prix = 18500,
        Couleur = "Blanc",
        Energie = "Essence",
        Transmission = "Manuelle",
        Description = "Véhicule en excellent état, entretien suivi"
    };
    
    context.Vehicules.Add(vehiculeTest);
    context.SaveChanges();
}