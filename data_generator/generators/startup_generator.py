import uuid
import random
import config
from faker import Faker

fake = Faker('en_IN')

def generate_startups():
    startups = []
    
    for i in range(config.NUM_STARTUPS):
        # Assign a primary sector
        primary_sector = random.choice(config.SECTORS)
        
        # Sub-sectors could be 1 or 2 other sectors or sub-domains
        sub_sectors = random.sample(config.SECTORS, random.randint(0, 2))
        if primary_sector in sub_sectors:
            sub_sectors.remove(primary_sector)
            
        tech_list = config.TECHNOLOGIES[primary_sector]
        num_primary_tech = random.randint(1, min(3, len(tech_list)))
        primary_tech = random.sample(tech_list, num_primary_tech)
        
        secondary_tech = []
        for s in sub_sectors:
            s_tech = config.TECHNOLOGIES[s]
            if s_tech:
                secondary_tech.append(random.choice(s_tech))
                
        secondary_tech = list(set(secondary_tech))
        
        years_operation = random.randint(1, 15)
        # Relevant experience is typically <= years of operation
        years_relevant = random.randint(0, years_operation)
        
        team_size = random.choice([random.randint(2, 10), random.randint(10, 50), random.randint(50, 200)])
        
        # Determine capability levels
        capability_profile = random.choice([
            "excellent_tech_excellent_exp",
            "excellent_tech_low_exp",
            "high_exp_weak_tech",
            "strong_sector_weak_scale",
            "strong_tech_geo_mismatch",
            "early_stage_excellent_prototype",
            "established_weak_relevance",
            "highly_specialized",
            "multi_sector",
            "incomplete_eligibility"
        ])
        
        eligibility_status = "Complete"
        if capability_profile == "incomplete_eligibility":
            eligibility_status = "Incomplete"
            
        if capability_profile == "early_stage_excellent_prototype":
            years_operation = random.randint(1, 2)
            years_relevant = years_operation
        elif capability_profile == "excellent_tech_low_exp":
            years_operation = random.randint(1, 3)
            years_relevant = random.randint(0, 1)
        elif "high_exp" in capability_profile or "established" in capability_profile:
            years_operation = random.randint(8, 15)
            years_relevant = years_operation - random.randint(0, 2)
            
        revenue = random.randint(0, 500) * 100000
        margin = random.randint(10, 80)
        
        # Create meaningful SBERT description
        company_name = fake.company()
        tech_str = ", ".join(primary_tech)
        desc_templates = [
            f"We build {tech_str} systems for {primary_sector.lower()} applications, delivering scalable solutions and intelligent integration.",
            f"{company_name} specializes in {tech_str} combined with innovative software to solve {primary_sector.lower()} challenges.",
            f"An innovative startup leveraging {tech_str} to revolutionize {primary_sector.lower()} operations.",
            f"We provide end-to-end {primary_sector.lower()} services powered by {tech_str} and a strong team of experts."
        ]
        
        startup = {
            "startup_id": str(uuid.uuid4()),
            "startup_name": company_name,
            "short_description": f"{primary_sector} startup focusing on {tech_str}",
            "detailed_description": random.choice(desc_templates),
            "sector": primary_sector,
            "sub_sectors": sub_sectors,
            "primary_technologies": primary_tech,
            "secondary_technologies": secondary_tech,
            "years_of_operation": years_operation,
            "years_of_relevant_experience": years_relevant,
            "team_size": team_size,
            "team_capabilities": random.choice(["Strong", "Average", "Specialized"]),
            "founder_experience_years": random.randint(years_operation, 25),
            "technical_team_percentage": random.randint(30, 90),
            "annual_revenue": revenue,
            "gross_margin_percentage": margin,
            "funding_stage": random.choice(["Bootstrapped", "Seed", "Series A", "Series B", "Series C"]),
            "funding_amount": random.randint(0, 20) * 1000000,
            "startup_stage": random.choice(["Prototype", "MVP", "Early Revenue", "Growth", "Mature"]),
            "certifications": random.sample(["ISO 27001", "SOC 2", "None", "CMMI"], random.randint(1, 2)),
            "previous_government_projects": random.randint(0, 5),
            "previous_enterprise_projects": random.randint(0, 20),
            "successful_deployments": random.randint(0, 15),
            "prototype_readiness": random.choice([True, False]) if years_operation < 3 else True,
            "production_readiness": random.choice([True, False]) if years_operation < 5 else True,
            "scalability_level": random.choice(["Low", "Medium", "High"]),
            "geographic_presence": random.choice(["Local", "Regional", "National"]),
            "headquarters_city": random.choice(config.CITIES),
            "operating_states": random.sample(["Karnataka", "Maharashtra", "Telangana", "Delhi", "Tamil Nadu", "Gujarat", "Kerala", "West Bengal", "UP"], random.randint(1, 4)),
            "preferred_deployment_locations": random.choice(["Pan India", random.choice(config.CITIES)]),
            "estimated_deployment_time_months": random.randint(1, 12),
            "compliance_capability": random.choice(["Basic", "Advanced", "Comprehensive"]),
            "support_capability": random.choice(["8x5", "24x7", "Community"]),
            "eligibility_status": eligibility_status,
            "capability_profile": capability_profile # Internal use for generating applications
        }
        startups.append(startup)
        
    return startups
