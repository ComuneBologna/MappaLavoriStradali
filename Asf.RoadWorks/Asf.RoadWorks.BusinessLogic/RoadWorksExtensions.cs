using Asf.RoadWorks.BusinessLogic.Interfaces;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartTech.Infrastructure.Extensions;
using SmartTech.Infrastructure.Maps;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	public static class RoadWorksExtensions
	{

		public static IServiceCollection AddRoadWorksService(this IServiceCollection services)
		{
			services.AddScoped<IRoadWorksService, RoadWorksService>();
			services.AddScoped<ICompanyService, CompanyService>();
			services.AddScoped<IRoadwayService, RoadwayService>();
			services.AddScoped<IConfigurationService, ConfigurationService>();
			services.AddScoped<IAuditService, AuditService>();
			services.AddScoped<IImportLogService, ImportLogService>();
			services.AddScoped<IUsersService, UsersService>();

			return services;
		}

		public static async Task<IEnumerable<T>> WhenAll<T>(this IQueryable<Task<T>> tasks)
		{
			return await Task.WhenAll(tasks);
		}

		public static string JsonToCSV(this string jsonContent, string delimiter)
		{
			var csvString = new StringWriter();

			using (var csv = new CsvWriter(csvString, new CsvConfiguration(CultureInfo.InvariantCulture)
			{
				Delimiter = delimiter
			}))
			{
				using var dt = jsonContent.JsonStringToTable();

				foreach (DataColumn column in dt.Columns)
					csv.WriteField(column.ColumnName);

				csv.NextRecord();

				foreach (DataRow row in dt.Rows)
				{
					for (var i = 0; i < dt.Columns.Count; i++)
						csv.WriteField(row[i]);

					csv.NextRecord();
				}
			}

			return csvString.ToString();
		}

		///Given the values for the first location in the list:
		///Lat1, lon1, years1, months1 and days1
		///1. Convert Lat1 and Lon1 from degrees to radians.
		///		lat1 = lat1 * PI/180
		///		lon1 = lon1 * PI/180
		///2. Convert lat/lon to Cartesian coordinates for first location.
		///		X1 = cos(lat1) * cos(lon1)
		///		Y1 = cos(lat1) * sin(lon1)
		///		Z1 = sin(lat1)
		///3. Compute weight (by time) for first location.
		///		w1= (years1 * 365.25) + (months1 * 30.4375) + days1
		///		If locations are to be weighted equally, set w1, w2 etc all equal to 1.
		///4. Repeat steps 1-3 for all remaining locations in the list.
		///5. Compute combined total weight for all locations.
		///		Totweight = w1 + w2 + ... + wn
		///6. Compute weighted average x, y and z coordinates.
		///		x = ((x1 * w1) + (x2 * w2) + ... + (xn * wn)) / totweight
		///		y = ((y1 * w1) + (y2 * w2) + ... + (yn * wn)) / totweight
		///		z = ((z1 * w1) + (z2 * w2) + ... + (zn * wn)) / totweight
		///7. Convert average x, y, z coordinate to latitude and longitude. Note that in Excel and possibly some other applications, the parameters need to be reversed in the atan2 function, for example, use atan2(X,Y) instead of atan2(Y,X).
		///		Lon = atan2(y, x)
		///		Hyp = sqrt(x * x + y * y)
		///		Lat = atan2(z, hyp)
		///8. Convert lat and lon to degrees.
		///		lat = lat * 180/PI
		///		lon = lon * 180/PI
		///9. Special case:
		///		If abs(x) < 10-9 and abs(y) < 10-9 and abs(z) < 10-9 then the geographic midpoint is the center of the earth.
		public static MapCoordinate CalculatesGeographicMidpoint(params MapCoordinate[] coordinates)
		{
			var weights = new List<dynamic>();

			coordinates.Where(c => c != null).ToList().ForEach(c =>
			{
				var latRad = c.Latitude * Math.PI / 180;
				var lonRad = c.Longitude * Math.PI / 180;
				var x = Math.Cos(latRad) * Math.Cos(lonRad);
				var y = Math.Cos(latRad) * Math.Sin(lonRad);
				var z = Math.Sin(latRad);

				weights.Add(new
				{
					x,
					y,
					z,
				});
			});

			if (weights.Count <= 0)
				return default;

			var avX = weights.Sum(w => (double)w.x) / weights.Count;
			var avY = weights.Sum(w => (double)w.y) / weights.Count;
			var avZ = weights.Sum(w => (double)w.z) / weights.Count;

			return new MapCoordinate
			{
				Latitude = Math.Atan2(avZ, Math.Sqrt(avX * avX + avY * avY)) * 180 / Math.PI,
				Longitude = Math.Atan2(avY, avX) * 180 / Math.PI
			};
		}

		static DataTable JsonStringToTable(this string jsonContent) => jsonContent.JsonDeserialize<DataTable>();
	}
}