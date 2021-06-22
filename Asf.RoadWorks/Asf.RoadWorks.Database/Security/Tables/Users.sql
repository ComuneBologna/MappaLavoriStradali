CREATE TABLE [Security].[Users]
(
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[CompanyId] BIGINT NULL,
	CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC),
	CONSTRAINT [FK_Users_Companies] FOREIGN KEY ([CompanyId]) REFERENCES [RoadWorks].[Companies] ([Id])
)