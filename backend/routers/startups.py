from fastapi import APIRouter, HTTPException
from typing import List
from models.domain import Startup
from lib.db import db

router = APIRouter(prefix="/startups", tags=["startups"])

@router.get("", response_model=List[Startup])
async def list_startups():
    cursor = db.synthetic_startups.find({})
    startups = await cursor.to_list(length=100)
    
    mapped = []
    for s in startups:
        s_dict = s.copy()
        if "startup_id" in s_dict and "id" not in s_dict:
            s_dict["id"] = s_dict["startup_id"]
        if "name" not in s_dict: s_dict["name"] = s_dict.get("startup_name", "Unknown")
        if "legalEntity" not in s_dict: s_dict["legalEntity"] = "Private Limited"
        if "registrationNo" not in s_dict: s_dict["registrationNo"] = "U12345"
        if "industry" not in s_dict: s_dict["industry"] = s_dict.get("sector", "Tech")
        if "location" not in s_dict: s_dict["location"] = s_dict.get("preferred_deployment_locations", "India")
        if "website" not in s_dict: s_dict["website"] = "https://example.com"
        if "dpiit" not in s_dict: s_dict["dpiit"] = "DIPP1234"
        if "founded" not in s_dict: s_dict["founded"] = 2020
        if "teamSize" not in s_dict: s_dict["teamSize"] = 10
        if "techTeamSize" not in s_dict: s_dict["techTeamSize"] = 5
        if "stage" not in s_dict: s_dict["stage"] = "Seed"
        if "fundingRaised" not in s_dict: s_dict["fundingRaised"] = "₹1 Crore"
        if "investors" not in s_dict: s_dict["investors"] = "None"
        if "annualRevenue" not in s_dict: s_dict["annualRevenue"] = f"₹{s_dict.get('annual_revenue', 0)/100000} Lakhs"
        if "grossProfit" not in s_dict: s_dict["grossProfit"] = "₹0 Crore"
        if "netPL" not in s_dict: s_dict["netPL"] = "₹0 Crore"
        if "plRatio" not in s_dict: s_dict["plRatio"] = "0%"
        if "product" not in s_dict: s_dict["product"] = "Product"
        if "problemSolved" not in s_dict: s_dict["problemSolved"] = "Problem"
        if "solution" not in s_dict: s_dict["solution"] = s_dict.get("short_description", "Solution")
        if "technology" not in s_dict: s_dict["technology"] = ", ".join(s_dict.get("primary_technologies", []))
        if "customers" not in s_dict: s_dict["customers"] = "N/A"
        if "deploymentScale" not in s_dict: s_dict["deploymentScale"] = "N/A"
        if "govtProjects" not in s_dict: s_dict["govtProjects"] = 0
        if "enterpriseClients" not in s_dict: s_dict["enterpriseClients"] = 0
        if "certifications" not in s_dict: s_dict["certifications"] = []
        if "patents" not in s_dict: s_dict["patents"] = 0
        if "awards" not in s_dict: s_dict["awards"] = []
        if "applications" not in s_dict: s_dict["applications"] = []
        
        mapped.append(Startup(**s_dict))
    
    return mapped

@router.get("/{startup_id}", response_model=Startup)
async def get_startup(startup_id: str):
    startup = await db.synthetic_startups.find_one({"startup_id": startup_id})
    if not startup:
        startup = await db.synthetic_startups.find_one({"id": startup_id})
        if not startup:
            raise HTTPException(status_code=404, detail="Startup not found")
            
    s_dict = startup.copy()
    if "startup_id" in s_dict and "id" not in s_dict:
        s_dict["id"] = s_dict["startup_id"]
    if "name" not in s_dict: s_dict["name"] = s_dict.get("startup_name", "Unknown")
    if "legalEntity" not in s_dict: s_dict["legalEntity"] = "Private Limited"
    if "registrationNo" not in s_dict: s_dict["registrationNo"] = "U12345"
    if "industry" not in s_dict: s_dict["industry"] = s_dict.get("sector", "Tech")
    if "location" not in s_dict: s_dict["location"] = s_dict.get("preferred_deployment_locations", "India")
    if "website" not in s_dict: s_dict["website"] = "https://example.com"
    if "dpiit" not in s_dict: s_dict["dpiit"] = "DIPP1234"
    if "founded" not in s_dict: s_dict["founded"] = 2020
    if "teamSize" not in s_dict: s_dict["teamSize"] = 10
    if "techTeamSize" not in s_dict: s_dict["techTeamSize"] = 5
    if "stage" not in s_dict: s_dict["stage"] = "Seed"
    if "fundingRaised" not in s_dict: s_dict["fundingRaised"] = "₹1 Crore"
    if "investors" not in s_dict: s_dict["investors"] = "None"
    if "annualRevenue" not in s_dict: s_dict["annualRevenue"] = f"₹{s_dict.get('annual_revenue', 0)/100000} Lakhs"
    if "grossProfit" not in s_dict: s_dict["grossProfit"] = "₹0 Crore"
    if "netPL" not in s_dict: s_dict["netPL"] = "₹0 Crore"
    if "plRatio" not in s_dict: s_dict["plRatio"] = "0%"
    if "product" not in s_dict: s_dict["product"] = "Product"
    if "problemSolved" not in s_dict: s_dict["problemSolved"] = "Problem"
    if "solution" not in s_dict: s_dict["solution"] = s_dict.get("short_description", "Solution")
    if "technology" not in s_dict: s_dict["technology"] = ", ".join(s_dict.get("primary_technologies", []))
    if "customers" not in s_dict: s_dict["customers"] = "N/A"
    if "deploymentScale" not in s_dict: s_dict["deploymentScale"] = "N/A"
    if "govtProjects" not in s_dict: s_dict["govtProjects"] = 0
    if "enterpriseClients" not in s_dict: s_dict["enterpriseClients"] = 0
    if "certifications" not in s_dict: s_dict["certifications"] = []
    if "patents" not in s_dict: s_dict["patents"] = 0
    if "awards" not in s_dict: s_dict["awards"] = []
    if "applications" not in s_dict: s_dict["applications"] = []
    
    return Startup(**s_dict)
