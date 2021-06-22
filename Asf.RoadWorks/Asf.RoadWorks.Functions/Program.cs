using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.Functions.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SmartTech.Common.Extensions;
using SmartTech.Infrastructure.Configuration.AzureApp;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.GoogleMaps;
using SmartTech.Infrastructure.Logging;
using SmartTech.Infrastructure.ServiceBus.SystemEvents;
using SmartTech.Infrastructure.Storage.AzureStorage;
using System;

namespace Asf.RoadWorks.Functions
{
	public class Program
	{
		public static void Main()
		{
			var host = new HostBuilder()
			.ConfigureAppConfiguration(builder =>
			{
				builder.ConfigureAzureAppConfiguration("RoadWorks");
				builder.AddEnvironmentVariables();
			})
			.ConfigureFunctionsWorkerDefaults()
			.ConfigureServices((builder, services) =>
			{
				var config = builder.Configuration;

				services.AddHttpClient();
				services.AddEFDbContext<RoadWorksDbContext>(Environment.GetEnvironmentVariable("RoadWorks:ConnectionString") ??
																config.GetSection("RoadWorks:ConnectionString")?.Value);
				services.AddDependencyTracker();
				services.AddApplicationInsightsForConsole(config, "roadworksfunctions");
				services.AddCustomLogging(config);
				services.AddSmartPAServices(config);
				services.AddSingleton(config);
				services.AddFileStorage(options => options.Endpoint = Environment.GetEnvironmentVariable("BlobStorageEndpoint") ??
																		config.GetSection("BlobStorage:Endpoint")?.Value);
				services.AddRoadWorksService();
				services.AddScoped<IUserContext, UserContext>();
				services.AddScoped<ISettableUserContext, UserContext>();
				services.AddSystemEvents(options => options.FullyQualifiedNamespace = Environment.GetEnvironmentVariable("ServiceBusFullyQualifiedNamespace") ??
																						config.GetSection("ServiceBus:FullyQualifiedNamespace")?.Value);
				services.AddGoogleMapsServices(options =>
				{
					options.MapsAPIKey = Environment.GetEnvironmentVariable("MapsGoogleApiKey") ??
											config.GetSection("Maps:GoogleApiKey")?.Value;
					options.MapsAPIUrl = Environment.GetEnvironmentVariable("MapsGoogleApiUrl") ??
											config.GetSection("Maps:GoogleApiUrl")?.Value;
				});
			}).Build();

			host.Run();
		}
	}
}