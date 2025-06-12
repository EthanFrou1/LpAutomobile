using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using LpAutomobile.Services;

namespace LpAutomobile.Middleware
{
    public class AdminAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public AdminAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAdminAuthService adminAuthService)
        {
            // Pages d'administration à protéger
            var adminPaths = new[]
            {
                "/Vehicules/Create",
                "/Vehicules/Edit",
                "/Vehicules/Delete",
                "/Vehicules/Index"
            };

            // Vérifier si on est sur une page admin
            bool isAdminPage = adminPaths.Any(path =>
                context.Request.Path.StartsWithSegments(path, StringComparison.OrdinalIgnoreCase));

            if (isAdminPage)
            {
                // Vérifier si l'IP est autorisée
                bool isAuthorized = adminAuthService.IsUserAdmin(context);

                // Si pas autorisé, retourner 403
                if (!isAuthorized)
                {
                    var clientIp = adminAuthService.GetClientIpAddress(context);

                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync($@"
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Accès refusé - LP Automobile</title>
                            <meta charset='utf-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <style>
                                body {{ 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    text-align: center; 
                                    padding: 50px; 
                                    background: #f8f9fa;
                                    margin: 0;
                                }}
                                .container {{
                                    max-width: 500px;
                                    margin: 0 auto;
                                    background: white;
                                    padding: 2rem;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                }}
                                .error {{ color: #dc3545; margin-bottom: 1rem; }}
                                .info {{ color: #6c757d; margin: 20px 0; line-height: 1.6; }}
                                .ip-info {{ 
                                    background: #f8f9fa; 
                                    padding: 1rem; 
                                    border-radius: 6px; 
                                    margin: 1rem 0;
                                    font-family: monospace;
                                    color: #333;
                                }}
                                .btn {{
                                    display: inline-block;
                                    background: #007bff;
                                    color: white;
                                    text-decoration: none;
                                    padding: 12px 24px;
                                    border-radius: 6px;
                                    transition: background 0.3s;
                                }}
                                .btn:hover {{ background: #0056b3; }}
                            </style>
                        </head>
                        <body>
                            <div class='container'>
                                <h1 class='error'>🔒 Accès refusé</h1>
                                <p>Cette page est réservée à l'administration du garage.</p>
                                <p class='info'>
                                    Seules les adresses IP autorisées peuvent accéder à cette section.
                                </p>
                                <div class='ip-info'>
                                    Votre adresse IP : <strong>{clientIp}</strong>
                                </div>
                                <p class='info'>
                                    Contactez l'administrateur pour ajouter votre IP aux adresses autorisées.
                                </p>
                                <a href='/' class='btn'>← Retour au site</a>
                            </div>
                        </body>
                        </html>
                    ");
                    return;
                }
            }

            await _next(context);
        }
    }
}