using Microsoft.Extensions.Hosting;
using System.Net.Http.Json;
using LpAutomobile.Data;
using LpAutomobile.Models;
using Microsoft.EntityFrameworkCore;

public class GoogleAvisSyncService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _config;

    public GoogleAvisSyncService(IServiceScopeFactory scopeFactory, IConfiguration config)
    {
        _scopeFactory = scopeFactory;
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Synchroniser();
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken); // ⏱ 1 appel / jour
        }
    }

    private async Task Synchroniser()
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var apiKey = _config["GoogleApiKey"];
        var placeId = _config["GooglePlaceId"];
        var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields=reviews&key={apiKey}";

        var response = await new HttpClient().GetFromJsonAsync<GooglePlacesResponse>(url);

        var nouveauxAvis = response?.Result?.Reviews;

        if (nouveauxAvis == null || !nouveauxAvis.Any())
            return;

        // Récupère les dates et contenus existants (identification basique)
        var existants = await db.AvisGoogle
            .Select(a => new { a.Auteur, a.DateAvis, a.Contenu })
            .ToListAsync();

        var avisAAjouter = nouveauxAvis
            .Select(r => new AvisGoogle
            {
                Auteur = r.AuthorName,
                Contenu = r.Text,
                Note = r.Rating,
                DateAvis = DateTimeOffset.FromUnixTimeSeconds(r.Time).DateTime,
                AuteurPhotoUrl = r.ProfilePhotoUrl
            })
            .Where(nouveau => !existants.Any(e =>
                e.Auteur == nouveau.Auteur &&
                e.DateAvis.Date == nouveau.DateAvis.Date && // simplification
                e.Contenu == nouveau.Contenu
            ))
            .ToList();

        if (avisAAjouter.Any())
        {
            db.AvisGoogle.AddRange(avisAAjouter);
            await db.SaveChangesAsync();
        }
    }

}

public class GooglePlacesResponse
{
    public GooglePlaceResult Result { get; set; } = new();
}
public class GooglePlaceResult
{
    public List<GoogleReview> Reviews { get; set; } = new();
}
public class GoogleReview
{
    public string AuthorName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public double Rating { get; set; }
    public long Time { get; set; }
    public string ProfilePhotoUrl { get; set; } = string.Empty;
}
