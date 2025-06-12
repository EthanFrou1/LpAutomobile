using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using LpAutomobile.Data;
using LpAutomobile.Middleware;
using LpAutomobile.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== CONFIGURATION BASE DE DONNÉES =====
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "lpautomobile.db");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// ===== SERVICES =====
builder.Services.AddHostedService<GoogleAvisSyncService>();

// ✅ SERVICES ADMIN
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();

// ✅ SERVICE EMAIL avec tous les services nécessaires
builder.Services.AddScoped<IEmailService, EmailService>();

// ✅ SERVICES NÉCESSAIRES POUR LE RENDU DES VUES (EmailService en a besoin)
builder.Services.AddSingleton<Microsoft.AspNetCore.Mvc.ViewEngines.ICompositeViewEngine, Microsoft.AspNetCore.Mvc.ViewEngines.CompositeViewEngine>();
builder.Services.AddSingleton<Microsoft.AspNetCore.Mvc.ViewFeatures.ITempDataProvider, Microsoft.AspNetCore.Mvc.ViewFeatures.CookieTempDataProvider>();

// ✅ IDENTITY
builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>();

// ✅ RAZOR PAGES (doit être APRÈS les autres services)
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

// ✅ MIDDLEWARE ADMIN
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
        context.Database.EnsureCreated();

        if (!context.Vehicules.Any())
        {
            SeedData(context);
        }
    }
}

app.Run();

// ===== DONNÉES DE TEST =====
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