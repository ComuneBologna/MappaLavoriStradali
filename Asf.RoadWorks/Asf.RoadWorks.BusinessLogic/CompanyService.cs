using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Search;
using SmartTech.Infrastructure.Validations;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class CompanyService : ICompanyService
	{
		readonly IUserContext _userContext;
		readonly RoadWorksDbContext _dbContext;

		public CompanyService(RoadWorksDbContext dbContext, IUserContext userContext)
		{
			_dbContext = dbContext;
			_userContext = userContext;
		}

		async Task<long> ICompanyService.AddCompany(CompanyWrite company)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			company?.Validate();

			if (_dbContext.Companies.AsNoTracking()
									.Any(ce => ce.AuthorityId == _userContext.AuthorityId &&
												ce.Name == company.Name))
				throw new BusinessLogicValidationException(string.Format(Resources.Company_AlreadyExists, company.Name));

			var c = new CompanyEntity
			{
				AuthorityId = _userContext.AuthorityId,
				IsOperationalUnit = company.IsOperationalUnit.Value,
				Name = company.Name
			};

			await _dbContext.Companies.AddAsync(c);
			await _dbContext.SaveChangesAsync();

			return c.Id;
		}

		async Task ICompanyService.DeleteCompany(long companyId)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (companyId <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, string.Format(Resources.Company_NotFound, companyId));

			if (_dbContext.Works.AsNoTracking()
								.Any(rwe => rwe.AuthorityId == _userContext.AuthorityId &&
											rwe.CompanyId == companyId))
				throw new BusinessLogicValidationException(string.Format(Resources.Company_WorksExist_NotDeleted, companyId));

			var ce = _dbContext.Companies
								.FirstOrDefault(c => c.AuthorityId == _userContext.AuthorityId &&
													c.Id == companyId);

			if (ce == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, string.Format(Resources.Company_NotFound, companyId));

			if (await _dbContext.Users.AsNoTracking().AnyAsync(u =>
												u.AuthorityId == _userContext.AuthorityId &&
												u.CompanyId == companyId))
				throw new BusinessLogicValidationException(string.Format(Resources.Company_UsersExist_NotDeleted, companyId));

			_dbContext.Companies.Remove(ce);
			await _dbContext.SaveChangesAsync();
		}

		async Task<FilterResult<Company>> ICompanyService.SearchCompanies(CompanySearchCriteria searchCriteria)
		{
			var sc = searchCriteria ?? new CompanySearchCriteria();
			var query = _dbContext.Companies
									.Include(c => c.Users)
									.AsNoTracking()
									.Where(c => c.AuthorityId == _userContext.AuthorityId);

			query = _userContext.CompanyId.HasValue ?
						query.Where(q => q.Id == _userContext.CompanyId) :
						sc.Id.HasValue ? query.Where(q => q.Id == sc.Id) : query;
			query = sc.IsOperationalUnit.HasValue ? query.Where(q => q.IsOperationalUnit == sc.IsOperationalUnit) : query;

			var elements = await query.OrderAndPageAsync(sc.MapCompanyOC());

			return new FilterResult<Company>()
			{
				Items = elements.Items.Select(el => new Company
				{
					Id = el.Id,
					IsOperationalUnit = el.IsOperationalUnit,
					Name = el.Name
				}),
				TotalCount = elements.TotalCount
			};
		}

		async Task ICompanyService.UpdateCompany(long id, CompanyWrite company)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (id <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, string.Format(Resources.Company_NotFound, id));

			company?.Validate();

			if (await _dbContext.Companies.AsNoTracking().AnyAsync(ce => ce.Name == company.Name && ce.Id != id))
				throw new BusinessLogicValidationException(string.Format(Resources.Company_AlreadyExists, company.Name));

			var ce = await _dbContext.Companies
									.FirstOrDefaultAsync(c => c.AuthorityId == _userContext.AuthorityId &&
																c.Id == id);

			if (ce == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, string.Format(Resources.Company_NotFound, id));

			_dbContext.Companies.Update(ce);
			await _dbContext.SaveChangesAsync();
		}

		async Task<Company> ICompanyService.GetUserCompany(Guid userId)
		{
			var company = (await _dbContext.Users
											.Include(i => i.Company)
											.AsNoTracking()
											.FirstOrDefaultAsync(f => f.AuthorityId == _userContext.AuthorityId &&
																		f.UserId == userId))?.Company;

			return company == default ? default : new Company()
			{
				Id = company.Id,
				IsOperationalUnit = company.IsOperationalUnit,
				Name = company.Name
			};
		}
	}
}