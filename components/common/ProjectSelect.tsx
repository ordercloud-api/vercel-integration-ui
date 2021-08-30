import { Button, Checkbox } from '@material-ui/core';
import React, { FC, useState } from 'react'
import { View } from '../../pages/callback'
import { VercelProject } from '../../types/VercelProject'

export interface ProjectActions {
    toAdd: VercelProject[],
    toRemove: VercelProject[]
}

const ProjectSelect: FC<{
  selectProjects: (actions: ProjectActions) => void,
  allProjects: VercelProject[],
  marketplaceID: string;
}> = ({ selectProjects, allProjects, marketplaceID }) => {
    var startingActiveProjects = allProjects.filter(project => {
        var env = project.env.find(e => e.key === "NEXT_PUBLIC_ORDERCLOUD_MARKETPLACE_ID");
        return env && env.value === marketplaceID;
    });

    const [activeProjects, setActiveProjects] = useState<string[]>(startingActiveProjects.map(x => x.id));

    const toggleActive = (projectID: string) => {
        setActiveProjects(oldProjects => {
            if (oldProjects.includes(projectID)) {
                // remove
                return oldProjects.filter(x => x !== projectID);
            } else {
                // add
                return [...oldProjects, projectID];
            }
        });
    }

    const select = () => {
        var toAdd = activeProjects
            .filter(p => !startingActiveProjects.some(sp => sp.id === p))
            .map(p => allProjects.find(ap => ap.id === p));
        var toRemove = startingActiveProjects
            .filter(p => !activeProjects.includes(p.id));
        selectProjects({ toAdd, toRemove })
    }

    var text = marketplaceID ?
        `These projects will be connected to the OrderCloud marketplace with ID ${marketplaceID}` :
         "A new OrderCloud marketplace will be seeded and these projects connected.";

    return (
        <div className="flex justify-center min-h-screen overflow-visible font-sans antialiased bg-primary-100">
            <div className="py-6 w-full md:max-w-3xl md:mt-8">
                <img src='/oc_banner_logo.svg' style={{width: "200px", paddingBottom: "1rem"}} alt='OrderCloud'/>
                <div className="rounded border border-primary-200 bg-white">
                    <div style={{padding: "1.5rem"}}>
                        <h4 style={{fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600}}>Select Vercel Projects</h4>
                        <p style={{fontSize: "0.875rem", lineHeight: "1.25rem", marginTop: "0.75rem"}}>{text}</p>
                        <div style={{marginTop: "1.5rem"}}>
                            {allProjects.map(project => {
                                var active = activeProjects.includes(project.id);
                                return <div style={{paddingBottom: "0.25rem"}} key={project.id}>
                                        <Checkbox
                                            checked={active}
                                            onClick={() => toggleActive(project.id)}
                                            key={project.id}/>
                                        <span style={{paddingLeft: "0.5rem"}}>{project.name}</span>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="mt-5" style={{float: "right"}}>
                    <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    size="large"
                    disabled={activeProjects.length < 1}
                    onClick={() => select()}
                    >
                    Save and Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProjectSelect
