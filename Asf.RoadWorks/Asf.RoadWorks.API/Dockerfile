#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y libgdiplus
RUN apt-get update -y && apt-get install -y libfontconfig
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Asf.RoadWorks/nuget.config", "."]
COPY ["Asf.RoadWorks/Asf.RoadWorks.API/Asf.RoadWorks.API.csproj", "Asf.RoadWorks.API/"]
COPY ["Asf.RoadWorks/Asf.RoadWorks.DataAccessLayer/Asf.RoadWorks.DataAccessLayer.csproj", "Asf.RoadWorks.DataAccessLayer/"]
COPY ["Asf.RoadWorks/Asf.RoadWorks.BusinessLogic/Asf.RoadWorks.BusinessLogic.csproj", "Asf.RoadWorks.BusinessLogic/"]
RUN dotnet restore "Asf.RoadWorks.API/Asf.RoadWorks.API.csproj"
COPY . .
WORKDIR "/src/Asf.RoadWorks/Asf.RoadWorks.API"
RUN dotnet build "Asf.RoadWorks.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Asf.RoadWorks.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Asf.RoadWorks.API.dll"]