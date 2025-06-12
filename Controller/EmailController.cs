using Microsoft.AspNetCore.Mvc;
using LpAutomobile.Services;
using LpAutomobile.Models;
using LpAutomobile.Data;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ApplicationDbContext _context;

        public EmailController(IEmailService emailService, ApplicationDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("contact-general")]
        public async Task<ActionResult<EmailResponseModel>> EnvoyerContactGeneral([FromBody] ContactGeneralModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new EmailResponseModel
                {
                    Success = false,
                    Message = "Données invalides",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var success = await _emailService.EnvoyerContactGeneralAsync(model);

            return Ok(new EmailResponseModel
            {
                Success = success,
                Message = success
                    ? "Votre message a été envoyé avec succès ! Nous vous répondrons rapidement."
                    : "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement."
            });
        }

        [HttpPost("interet-vehicule")]
        public async Task<ActionResult<EmailResponseModel>> EnvoyerInteretVehicule([FromBody] InteretVehiculeModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new EmailResponseModel
                {
                    Success = false,
                    Message = "Données invalides",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            // Récupérer les infos du véhicule
            var vehicule = await _context.Vehicules
                .FirstOrDefaultAsync(v => v.Id == model.VehiculeId);

            if (vehicule == null)
            {
                return BadRequest(new EmailResponseModel
                {
                    Success = false,
                    Message = "Véhicule introuvable"
                });
            }

            // Remplir les infos du véhicule
            model.VehiculeInfo = $"{vehicule.Marque} {vehicule.Modele} ({vehicule.Annee})";
            model.Prix = vehicule.Prix;

            var success = await _emailService.EnvoyerInteretVehiculeAsync(model);

            return Ok(new EmailResponseModel
            {
                Success = success,
                Message = success
                    ? "Votre demande a été envoyée ! Nous vous contacterons rapidement."
                    : "Erreur lors de l'envoi. Veuillez réessayer."
            });
        }

        [HttpPost("demande-estimation")]
        public async Task<ActionResult<EmailResponseModel>> EnvoyerDemandeEstimation([FromBody] DemandeEstimationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new EmailResponseModel
                {
                    Success = false,
                    Message = "Données invalides",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            var success = await _emailService.EnvoyerDemandeEstimationAsync(model);

            return Ok(new EmailResponseModel
            {
                Success = success,
                Message = success
                    ? "Votre demande d'estimation a été envoyée ! Nous vous répondrons rapidement."
                    : "Erreur lors de l'envoi. Veuillez réessayer."
            });
        }
    }
}