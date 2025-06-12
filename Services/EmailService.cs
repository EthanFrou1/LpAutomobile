using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using LpAutomobile.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace LpAutomobile.Services
{
    public interface IEmailService
    {
        Task<bool> EnvoyerContactGeneralAsync(ContactGeneralModel model);
        Task<bool> EnvoyerInteretVehiculeAsync(InteretVehiculeModel model);
        Task<bool> EnvoyerDemandeEstimationAsync(DemandeEstimationModel model);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ICompositeViewEngine _viewEngine;
        private readonly ITempDataProvider _tempDataProvider;
        private readonly IServiceProvider _serviceProvider;

        public EmailService(
            IConfiguration configuration,
            ICompositeViewEngine viewEngine,
            ITempDataProvider tempDataProvider,
            IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _viewEngine = viewEngine;
            _tempDataProvider = tempDataProvider;
            _serviceProvider = serviceProvider;
        }

        public async Task<bool> EnvoyerContactGeneralAsync(ContactGeneralModel model)
        {
            try
            {
                var subject = $"[LP Automobile] Contact général - {model.Nom}";
                var body = await RenderViewToStringAsync("ContactGeneral", model);

                return await EnvoyerEmailAsync(subject, body, model.Email, model.Nom);
            }
            catch (Exception ex)
            {
                // Log l'erreur (tu peux ajouter un système de logging plus tard)
                Console.WriteLine($"Erreur envoi contact général: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EnvoyerInteretVehiculeAsync(InteretVehiculeModel model)
        {
            try
            {
                var subject = $"[LP Automobile] {model.TypeDemande} véhicule - {model.VehiculeInfo}";
                var body = await RenderViewToStringAsync("InteretVehicule", model);

                return await EnvoyerEmailAsync(subject, body, model.Email, model.Nom);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur envoi intérêt véhicule: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> EnvoyerDemandeEstimationAsync(DemandeEstimationModel model)
        {
            try
            {
                var subject = $"[LP Automobile] Demande d'estimation - {model.Marque} {model.Modele}";
                var body = await RenderViewToStringAsync("DemandeEstimation", model);

                return await EnvoyerEmailAsync(subject, body, model.Email, model.Nom);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur envoi demande estimation: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> EnvoyerEmailAsync(string subject, string body, string fromEmail, string fromName)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("EmailSettings");

                using var client = new SmtpClient(smtpSettings["SmtpServer"])
                {
                    Port = int.Parse(smtpSettings["Port"]),
                    Credentials = new NetworkCredential(
                        smtpSettings["Username"],
                        smtpSettings["Password"]
                    ),
                    EnableSsl = bool.Parse(smtpSettings["EnableSsl"])
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings["Username"], "LP Automobile Site Web"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                // Email de destination (le garage)
                mailMessage.To.Add(smtpSettings["ContactEmail"]);

                // Ajouter l'email du client en réponse
                mailMessage.ReplyToList.Add(new MailAddress(fromEmail, fromName));

                await client.SendMailAsync(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur SMTP: {ex.Message}");
                return false;
            }
        }

        private async Task<string> RenderViewToStringAsync<TModel>(string viewName, TModel model)
        {
            var actionContext = GetActionContext();
            var viewResult = _viewEngine.FindView(actionContext, $"Email/{viewName}", false);

            if (!viewResult.Success)
            {
                throw new InvalidOperationException($"View 'Email/{viewName}' not found");
            }

            using var stringWriter = new StringWriter();
            var viewContext = new ViewContext(
                actionContext,
                viewResult.View,
                new ViewDataDictionary<TModel>(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = model
                },
                new TempDataDictionary(actionContext.HttpContext, _tempDataProvider),
                stringWriter,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return stringWriter.ToString();
        }

        private ActionContext GetActionContext()
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = _serviceProvider
            };

            return new ActionContext(httpContext, new RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        }
    }
}