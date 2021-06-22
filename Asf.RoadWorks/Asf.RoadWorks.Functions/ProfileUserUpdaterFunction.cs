using Asf.RoadWorks.BusinessLogic.Events;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartTech.Common.Extensions;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Extensions;
using SmartTech.Infrastructure.Functions;
using System;
using System.Globalization;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Asf.RoadWorks.Functions
{
	public static class ProfileUserUpdaterFunction
	{
		[Function("ProfileUserUpdaterFunction")]
		public static async Task Run([ServiceBusTrigger("sysevents", "roadworksprofileupdater", Connection = "SmartPAServiceBusConnectionString")] SystemEvent smartPAevent, FunctionContext executionContext)
		{
			var log = executionContext.GetLogger("ProfileUserUpdaterFunction");

			log.LogInformation($"C# ServiceBus topic trigger function processed message: {smartPAevent.JsonSerialize()}");
			Thread.CurrentThread.CurrentCulture = CultureInfo.GetCultureInfo("it-IT");

			var smartPAClientData = default(SmartPAClientData);
			var httpClientFactory = default(IHttpClientFactory);
			var dbContext = default(RoadWorksDbContext);
			var backofficeUsersService = default(IBackofficeUsersService);
			var type = smartPAevent.Type;
			var tenantId = smartPAevent.TenantId;
			var userId = type.Equals(EventTypes.SmartPAProfileUpserted) ?
				smartPAevent.Payload.JsonDeserialize<SmartPAPayloadItem>()?.UserId : default;
			long? authorityId = smartPAevent.AuthorityId;

			if (type.Equals(EventTypes.SmartPAProfileUpserted))
			{
				smartPAClientData = executionContext.GetService<SmartPAClientData>();
				httpClientFactory = executionContext.GetService<IHttpClientFactory>();
				dbContext = executionContext.GetService<RoadWorksDbContext>();
				backofficeUsersService = executionContext.GetService<IBackofficeUsersService>();
			}

			try
			{
				if (!type.Equals(EventTypes.SmartPAProfileUpserted))
					return;

				BusinessLogicValidation.Validation(() => !userId.HasValue, "UserId required");

				var dbUser = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);

				if (dbUser == default)
					return;

				var accessToken = await GetClientApplicationToken(smartPAClientData, httpClientFactory, tenantId, default);
				var user = await backofficeUsersService.GetUserProfile(userId.Value, accessToken);

				if (user != default)
					return;

				dbContext.Users.Remove(dbUser);
				await dbContext.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				log.LogError(ex, $"Internal error in ProfileUserUpdaterFunction: {ex.Message}");
				Console.WriteLine($"Internal error in ProfileUserUpdaterFunction [{DateTime.UtcNow}]: {ex.Message}");
			}
		}

		#region private methods

		static async Task<string> GetClientApplicationToken(SmartPAClientData smartPAClientData, IHttpClientFactory httpClientFactory, Guid tenantId, long? authorityId) =>
			await httpClientFactory.GetClientApplicationToken(smartPAClientData, authorityId.HasValue ? authorityId.ToString() : string.Empty, tenantId);

		#endregion
	}
}