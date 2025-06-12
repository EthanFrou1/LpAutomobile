using System.Net;
using System.Net.Mail;
using System.Text;
using LpAutomobile.Models;

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
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        // =================================
        // MÉTHODES PRINCIPALES
        // =================================

        public async Task<bool> EnvoyerContactGeneralAsync(ContactGeneralModel model)
        {
            try
            {
                var htmlBody = GenerateContactEmailTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"🚗 Nouveau contact de {model.Nom} - LP Automobile",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email de contact envoyé avec succès pour {Email}", model.Email);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email de contact pour {Email}", model.Email);
                return false;
            }
        }

        public async Task<bool> EnvoyerInteretVehiculeAsync(InteretVehiculeModel model)
        {
            try
            {
                var htmlBody = GenerateInterestEmailTemplate(model);

                var subject = model.TypeDemande switch
                {
                    "Essai" => $"🔥 Demande d'essai - {model.VehiculeInfo}",
                    "Offre" => $"💰 Offre d'achat - {model.VehiculeInfo}",
                    _ => $"❤️ Intérêt pour {model.VehiculeInfo}"
                };

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: subject,
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email d'intérêt envoyé pour {Email} - {TypeDemande}", model.Email, model.TypeDemande);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email d'intérêt pour {Email}", model.Email);
                return false;
            }
        }

        public async Task<bool> EnvoyerDemandeEstimationAsync(DemandeEstimationModel model)
        {
            try
            {
                var htmlBody = GenerateEstimationEmailTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"💰 Demande d'estimation - {model.Marque} {model.Modele} ({model.Annee})",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email d'estimation envoyé pour {Email} - {Marque} {Modele}", model.Email, model.Marque, model.Modele);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email d'estimation pour {Email}", model.Email);
                return false;
            }
        }

        // =================================
        // TEMPLATES HTML INTÉGRÉS
        // =================================

        private string GenerateContactEmailTemplate(ContactGeneralModel model)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Nouveau contact - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                    
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Nouveau message de contact</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                        <div style='background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin-bottom: 25px;'>
                            <h2 style='margin: 0 0 15px 0; color: #333; font-size: 20px;'>📧 Informations du contact</h2>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>👤 Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>✉️ Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #007bff; text-decoration: none;'>{model.Email}</a>
                            </div>

                            {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>📞 Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #007bff; text-decoration: none;'>{model.Telephone}</a>
                            </div>" : "")}

                            {(!string.IsNullOrEmpty(model.Sujet) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>📋 Sujet :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Sujet}</span>
                            </div>" : "")}
                            
                            <div>
                                <strong style='color: #007bff;'>🕒 Date :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Message :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Message.Replace("\n", "<br>")}
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <a href='mailto:{model.Email}?subject=RE: Votre contact LP Automobile' 
                           style='display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            📧 Répondre par email
                        </a>
                        {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                        <a href='https://wa.me/{model.Telephone}' 
                           style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler le client
                        </a>" : "")}
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GenerateInterestEmailTemplate(InteretVehiculeModel model)
        {
            var headerColor = model.TypeDemande switch
            {
                "Essai" => "#ff6b6b",
                "Offre" => "#28a745",
                _ => "#007bff"
            };

            var headerEmoji = model.TypeDemande switch
            {
                "Essai" => "🔥",
                "Offre" => "💰",
                _ => "❤️"
            };

            var urgencySection = model.TypeDemande == "Essai" ? @"
                <div style='background: #ff6b6b; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 8px;'>
                    <strong>⚡ DEMANDE D'ESSAI - RÉPONSE RAPIDE RECOMMANDÉE ⚡</strong>
                </div>" : "";

            var offerSection = model.TypeDemande == "Offre" && model.OffrePrix.HasValue ? $@"
                <div style='background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px;'>
                    <h3 style='margin: 0 0 10px 0; color: #155724;'>💰 OFFRE PROPOSÉE : {model.OffrePrix.Value:C0}</h3>
                    <p style='margin: 0; color: #155724;'>Différence avec le prix affiché : {(model.OffrePrix.Value - model.Prix):C0}</p>
                </div>" : "";

            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Intérêt véhicule - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                    
                    <!-- Header -->
                    <div style='background: {headerColor}; color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>{headerEmoji} {model.TypeDemande} pour un véhicule</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                        
                        {urgencySection}
                        {offerSection}

                        <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 20px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h2 style='margin: 0 0 10px 0; color: white; font-size: 24px;'>🚗 {model.VehiculeInfo}</h2>
                            <p style='margin: 0 0 5px 0; color: white;'><strong>Prix affiché :</strong> {model.Prix:C0}</p>
                            <p style='margin: 0; color: white; opacity: 0.8;'><small>ID véhicule : #{model.VehiculeId}</small></p>
                        </div>

                        <div style='background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>👤 Informations du client :</h3>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: {headerColor};'>Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: {headerColor};'>Email :</strong>
                                <a href='mailto:{model.Email}' style='color: {headerColor}; text-decoration: none;'>{model.Email}</a>
                            </div>

                            {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: {headerColor};'>Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: {headerColor}; text-decoration: none;'>{model.Telephone}</a>
                            </div>" : "")}
                            
                            <div>
                                <strong style='color: {headerColor};'>Date :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        {(!string.IsNullOrEmpty(model.Message) ? $@"
                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Message du client :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Message.Replace("\n", "<br>")}
                            </div>
                        </div>" : "")}
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <a href='mailto:{model.Email}?subject=RE: Votre {model.TypeDemande.ToLower()} pour {model.VehiculeInfo}' 
                           style='display: inline-block; background-color: {headerColor}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            📧 Contacter le client
                        </a>
                        {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                        <a href='tel:{model.Telephone}' 
                           style='display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler maintenant
                        </a>" : "")}
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GenerateEstimationEmailTemplate(DemandeEstimationModel model)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Demande d'estimation - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                    
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>💰 Demande d'estimation</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                        <div style='background: linear-gradient(135deg, #6f42c1, #563d7c); color: white; padding: 20px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h2 style='margin: 0 0 15px 0; color: white; font-size: 24px;'>🚗 Véhicule à estimer</h2>
                            <h3 style='margin: 0 0 10px 0; color: white;'>{model.Marque} {model.Modele} ({model.Annee})</h3>
                            <p style='margin: 0; color: white;'><strong>Kilométrage :</strong> {model.Kilometrage:N0} km</p>
                            {(!string.IsNullOrEmpty(model.Energie) ? $"<p style='margin: 5px 0 0 0; color: white;'><strong>Énergie :</strong> {model.Energie}</p>" : "")}
                            {(!string.IsNullOrEmpty(model.Transmission) ? $"<p style='margin: 5px 0 0 0; color: white;'><strong>Transmission :</strong> {model.Transmission}</p>" : "")}
                        </div>

                        <div style='background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>👤 Informations du propriétaire :</h3>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #ffc107; text-decoration: none;'>{model.Email}</a>
                            </div>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #ffc107; text-decoration: none;'>{model.Telephone}</a>
                            </div>

                            {(!string.IsNullOrEmpty(model.EtatGeneral) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>État général :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.EtatGeneral}</span>
                            </div>" : "")}

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>En panne :</strong>
                                <span style='color: #333; font-size: 16px;'>{(model.EstEnPanne ? "❌ Oui" : "✅ Non")}</span>
                            </div>

                            {(model.EstEnPanne && !string.IsNullOrEmpty(model.DescriptionPanne) ? $@"
                            <div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px; margin-top: 15px; border: 1px solid #f5c6cb;'>
                                <strong>⚠️ Description de la panne :</strong><br>
                                {model.DescriptionPanne.Replace("\n", "<br>")}
                            </div>" : "")}
                            
                            <div>
                                <strong style='color: #ffc107;'>Date de demande :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        {(!string.IsNullOrEmpty(model.Message) ? $@"
                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Message complémentaire :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Message.Replace("\n", "<br>")}
                            </div>
                        </div>" : "")}

                        <!-- Conseils -->
                        <div style='background: #d1ecf1; padding: 20px; border-radius: 8px; border: 1px solid #bee5eb;'>
                            <h4 style='margin-top: 0; color: #0c5460;'>💡 Conseils pour l'estimation :</h4>
                            <ul style='margin-bottom: 0; color: #0c5460;'>
                                <li><strong>Vérifier l'état réel</strong> lors d'une visite</li>
                                <li><strong>Consulter la cote Argus</strong> pour le modèle</li>
                                <li><strong>Prendre en compte</strong> l'entretien et l'historique</li>
                                {(model.EstEnPanne ? "<li><strong>Évaluer le coût</strong> de réparation de la panne</li>" : "")}
                                <li><strong>Proposer un RDV</strong> pour inspection complète</li>
                                <li><strong>Présenter vos véhicules</strong> en échange</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <a href='mailto:{model.Email}?subject=RE: Estimation de votre {model.Marque} {model.Modele}' 
                           style='display: inline-block; background-color: #ffc107; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            📧 Envoyer l'estimation
                        </a>
                        <a href='tel:{model.Telephone}' 
                           style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler le propriétaire
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        // =================================
        // MÉTHODES PRIVÉES
        // =================================

        private async Task SendEmailAsync(string to, string subject, string htmlBody, string? replyToEmail = null)
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");

            using var client = new SmtpClient(smtpSettings["SmtpServer"], int.Parse(smtpSettings["Port"]))
            {
                Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"])
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["FromEmail"], smtpSettings["FromName"]),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            mailMessage.To.Add(to);

            if (!string.IsNullOrEmpty(replyToEmail))
            {
                mailMessage.ReplyToList.Add(replyToEmail);
            }

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email envoyé avec succès vers {To} - Sujet: {Subject}", to, subject);
        }
    }
}