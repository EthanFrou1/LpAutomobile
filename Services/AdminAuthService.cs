using Microsoft.Extensions.Configuration;

namespace LpAutomobile.Services
{
    public interface IAdminAuthService
    {
        bool IsUserAdmin(HttpContext context);
        string GetClientIpAddress(HttpContext context);
    }

    public class AdminAuthService : IAdminAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly string[] _allowedIps;

        public AdminAuthService(IConfiguration configuration)
        {
            _configuration = configuration;
            _allowedIps = _configuration.GetSection("AdminSettings:AllowedIps").Get<string[]>() ?? new string[0];
        }

        public bool IsUserAdmin(HttpContext context)
        {
            // Si aucune IP configurée, accès refusé
            if (_allowedIps.Length == 0)
            {
                return false;
            }

            // Vérifier si l'IP client est autorisée
            var clientIp = GetClientIpAddress(context);
            return _allowedIps.Contains(clientIp);
        }

        public string GetClientIpAddress(HttpContext context)
        {
            // Gérer les proxies et load balancers
            string? ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (string.IsNullOrEmpty(ipAddress))
                ipAddress = context.Request.Headers["X-Real-IP"].FirstOrDefault();

            if (string.IsNullOrEmpty(ipAddress))
                ipAddress = context.Connection.RemoteIpAddress?.ToString();

            // Nettoyer l'IP (prendre la première si plusieurs)
            if (!string.IsNullOrEmpty(ipAddress) && ipAddress.Contains(','))
                ipAddress = ipAddress.Split(',')[0].Trim();

            return ipAddress ?? "unknown";
        }
    }
}