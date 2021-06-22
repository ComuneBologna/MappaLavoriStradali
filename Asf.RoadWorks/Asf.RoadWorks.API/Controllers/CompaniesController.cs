using Asf.RoadWorks.API.Authentication;
using Asf.RoadWorks.API.Code;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SmartTech.Common.Extensions;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Common.Web.Security;
using SmartTech.Infrastructure.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{
	public class CompaniesController : RoadWorksBaseController
	{
		readonly ICompanyService _companyService;
		readonly SmartPAClientData _smartPAClientData;
		readonly IBackofficeUsersService _userService;
		readonly IHttpClientFactory _httpClientFactory;

		public CompaniesController(ICompanyService companyService, IBackofficeUsersService userService,
			IHttpClientFactory httpClientFactory, IOptions<SmartPAClientData> smartPAClientDataOptions)
		{
			_userService = userService;
			_companyService = companyService;
			_httpClientFactory = httpClientFactory;
			_smartPAClientData = smartPAClientDataOptions.Value;
		}

		/// <summary>
		/// Gets the companies.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_PressOffice, Roles.Tenant_Admin)]
		public async Task<FilterResult<Company>> GetCompanies(bool? isOperationalUnit) =>
			(await _companyService.SearchCompanies(new CompanySearchCriteria
			{
				IsOperationalUnit = isOperationalUnit,
				ItemsPerPage = int.MaxValue,
				PageNumber = 1,
				Ascending = true,
				KeySelector = nameof(Company.Name)
			}));

		/// <summary>
		/// Gets the companies.
		/// </summary>
		/// <returns></returns>
		[HttpGet("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<Company> GetCompanies(long id) =>
			(await _companyService.SearchCompanies(new CompanySearchCriteria { Id = id })).Items.FirstOrDefault();

		/// <summary>
		/// Gets the companies.
		/// </summary>
		/// <returns></returns>
		[HttpGet("mycompany")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<Company> GetMyCompany() => await _companyService.GetUserCompany(User.UserId());

		/// <summary>
		/// Posts the specified company.
		/// </summary>
		/// <param name="company">The company.</param>
		[HttpPost]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<long> Post([FromBody] CompanyWrite company) => await _companyService.AddCompany(company);

		/// <summary>
		/// Puts the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="company">The company.</param>
		[HttpPut("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Put(long id, [FromBody] CompanyWrite company) => await _companyService.UpdateCompany(id, company);

		/// <summary>
		/// Deletes the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		[HttpDelete("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Delete(long id) => await _companyService.DeleteCompany(id);

		/// <summary>
		/// Gets the company account information.
		/// </summary>
		/// <param name="companyId">The company identifier.</param>
		/// <returns></returns>
		[HttpGet("account/info")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<BaseUserInfo> GetCompanyAccountInfo()
		{
			var accessToken = await _httpClientFactory.GetClientApplicationToken(_smartPAClientData, User.AuthorityId(), User.TenantId());

			return (await _userService.GetUsersInfo(new List<Guid>
														{
															User.UserId()
														}, accessToken)).FirstOrDefault();
		}
	}
}