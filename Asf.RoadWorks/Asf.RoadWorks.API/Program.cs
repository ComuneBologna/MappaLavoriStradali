using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using SmartTech.Infrastructure.Configuration.AzureApp;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API
{
	class Program
	{
		public static async Task Main(string[] args) => await CreateHostBuilder(args).Build().RunAsync();

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.ConfigureAzureAppConfiguration("RoadWorks")
				.ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>());
	}
}