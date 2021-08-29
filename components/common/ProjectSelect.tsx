import { Button } from '@material-ui/core';
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

    return (
        <div>
        <h4 className="text-xl font-semibold">Select Projects to Connect to OrderCloud</h4>
            {allProjects.map(project => {
                var active = activeProjects.includes(project.id);
                return <div key={project.id}>
                    <span>{project.name}</span> - <span onClick={() => toggleActive(project.id)}>{active ? "Active" : "Not"}</span>
                </div>
            })}
            <Button
              className="mt-5"
              color="secondary"
              type="submit"
              size="large"
              disabled={activeProjects.length < 1}
              onClick={() => select()}
            >
              Save Changes and Continue
            </Button>
        </div>

    );
}

export default ProjectSelect
