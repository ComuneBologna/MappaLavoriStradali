using Asf.RoadWorks.API.Authentication;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.DataAccessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using SmartTech.Common;
using SmartTech.Common.Extensions;
using SmartTech.Common.Services;
using SmartTech.Common.Web.Security.Extensions;
using SmartTech.Infrastructure.API.Extensions;
using SmartTech.Infrastructure.API.Security;
using SmartTech.Infrastructure.API.Swagger;
using SmartTech.Infrastructure.Cache.Redis;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.GoogleMaps;
using SmartTech.Infrastructure.Logging;
using SmartTech.Infrastructure.ServiceBus.SystemEvents;
using SmartTech.Infrastructure.Storage.AzureStorage;
using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API
{
	class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			IdentityModelEventSource.ShowPII = true;

			var cultureInfo = new CultureInfo("it-IT");

			CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
			CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

			services.AddAPIControllers();
			services.AddHttpClient();
			services.AddRouting(options => options.LowercaseUrls = true);
			services.Configure<ApiBehaviorOptions>(options =>
			{
				options.SuppressModelStateInvalidFilter = true;
				options.SuppressMapClientErrors = true;
			});
			services.Configure<ForwardedHeadersOptions>(options =>
			{
				options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
			});
			services.AddCors(options =>
			{
				options.AddPolicy("default", policy =>
				{
					policy
					.AllowAnyHeader()
					.AllowAnyMethod()
					.AllowAnyOrigin();
				});
			});
			services.AddDependencyTracker();
			services.AddApplicationInsightsForAspNetCore(Configuration, "RoadWorksAPI");
			services.AddCustomLogging(Configuration);
			services.AddAPIVersioning(Configuration);
			services.AddSwagger(Configuration);
			services.AddRoadWorksService();
			services.AddEFDbContext<RoadWorksDbContext>(Environment.GetEnvironmentVariable("RoadWorks:ConnectionString") ??
														Configuration.GetSection("RoadWorks:ConnectionString")?.Value);
			services.AddCaching(options =>
			{
				options.CacheConfiguration = Configuration["Cache:CacheConfiguration"];
				options.MaxObjectSize = int.Parse(Configuration["Cache:MaxObjectSize"]);
				options.ThrowExceptionOnError = bool.Parse(Configuration["Cache:ThrowExceptionOnError"]);
				options.ThrowExceptionOnMiss = bool.Parse(Configuration["Cache:ThrowExceptionOnMiss"]);
			});
			services.AddDataProtection();
			services.AddHttpContextAccessor();
			services.AddCustomAuthentication(Configuration, async ctx => await OnTokenValidated(ctx));
			services.AddSmartPAServices(Configuration);
			services.AddSmartPAAuthorizations();
			services.AddScoped<IUserContext, UserContext>();
			services.AddFileStorage(options =>
			{
				var blobStorageEndpoint = Environment.GetEnvironmentVariable("BlobStorageEndpoint") ??
											Configuration.GetSection("BlobStorage:Endpoint")?.Value;

				options.Endpoint = blobStorageEndpoint;
			});
			services.AddSystemEvents(options =>
			{
				var roadWorksServiceBusFullyQualifiedNamespace = Environment.GetEnvironmentVariable("ServiceBusFullyQualifiedNamespace") ??
												Configuration.GetSection("ServiceBus:FullyQualifiedNamespace")?.Value;

				options.FullyQualifiedNamespace = roadWorksServiceBusFullyQualifiedNamespace;
			});
			services.AddGoogleMapsServices(options =>
			{
				options.MapsAPIKey = Environment.GetEnvironmentVariable("MapsGoogleApiKey") ??
												Configuration.GetSection("Maps:GoogleApiKey")?.Value;
				options.MapsAPIUrl = Environment.GetEnvironmentVariable("MapsGoogleApiUrl") ??
												Configuration.GetSection("Maps:GoogleApiUrl")?.Value;
			});
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			var environment = Environment.GetEnvironmentVariable("DeployEnvironment") ?? DeployEnvironments.Kubernetes;

			if (env.IsDevelopment())
				app.UseDeveloperExceptionPage();
			else
				app.UseHsts();

			app.UseForwardedHeaders();
			app.Use((context, next) =>
			{
				context.Request.Scheme = "https";

				return next();
			});
			app.UseCors("default");
			app.UseHttpsRedirection();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();

			if (environment.Equals(DeployEnvironments.Kubernetes, StringComparison.InvariantCultureIgnoreCase))
				app.UseSwaggerGen("roadworks");
			else
				app.UseSwaggerGen();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapControllerRoute("default", "{controller}/{action}/{id?}");
			});
		}

		async Task OnTokenValidated(TokenValidatedContext ctx)
		{
			var authorityId = ctx.Request.Headers["AuthorityId"];
			var smartPAUserId = ctx.Principal.UserId();
			var accessToken = ctx.Request.GetBearerToken();
			var claimsReaderClient = ctx.HttpContext.RequestServices.GetService<IClaimsReaderClient>();
			var permissionCodes = await claimsReaderClient.GetCurrentUserClaimCodes(smartPAUserId.ToString(), accessToken, long.Parse(authorityId));

			if (permissionCodes.Any(p => p.Equals(Roles.SmartPARole.Code)))
			{
				var dbContext = ctx.HttpContext.RequestServices.GetService<RoadWorksDbContext>();
				var user = dbContext.Users
							.AsNoTracking()
							.FirstOrDefault(f => f.UserId == smartPAUserId && f.AuthorityId == long.Parse(authorityId));

				if (user != default)
				{
					ctx.Principal.AddClaim(AuthenticationConstants.CompanyId, user.CompanyId?.ToString() ?? string.Empty);
					ctx.Principal.AddClaim("permission", user.RoleCode);
				}
			}
			else
			{
				if (!permissionCodes.Any(p => p.Equals(Roles.TenantAdmin.Code)))
				{
					ctx.Fail("Invalid user");

					return;
				}
			}

			var claims = permissionCodes.Select(c => new Claim("permission", c)).ToList();

			ctx.Principal.AddClaims(claims);
			ctx.Principal.AddClaim(AuthenticationConstants.AuthorityId, authorityId);
		}
	}
}