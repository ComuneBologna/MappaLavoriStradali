CREATE TABLE [Security].[RolesForUsers]
(
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[AuthorityId] BIGINT NOT NULL,
	[CompanyId] BIGINT NULL,
	[RoleCode] NVARCHAR(64) NOT NULL,
	CONSTRAINT [PK_RolesUsers] PRIMARY KEY CLUSTERED ([UserId] ASC),
	CONSTRAINT [FK_RolesUsers_Companies] FOREIGN KEY ([CompanyId]) REFERENCES [RoadWorks].[Companies] ([Id])
)