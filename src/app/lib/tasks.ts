export const tasks = {
  CLN: [
    {id: 0, title: "Site Qualification Visit"},
    {id: 1, title: "Site Initiation Visit" },
    //{id: 2, title: "Site Monitoring Visit" },
    //{id: 3, title: "Site Close-out Visit" },
  ],
  DM: [
    {id: 0, title: "Data Management & Statistics Plan Development", subtitle: null},
    {id: 1, title: "Database cleaning", subtitle: ["Interim data review", "Final data review"]},
    //{id: 2, title: "Database creation and testing", subtitle: null},
    //{id: 3, title: "Single Data Entry", subtitle: null},  
  ]
};

export const subtasks = {
  CLN: [
    {
      head: "Site Qualification Visit",
      details: [
        {id: 0, subtitle: "Preparing for SQV" },
        {id: 1, subtitle: "Performing SQV" },
        //{id: 2, subtitle: "Provide written SQV Report" },
        //{id: 3, subtitle: "Travel to the Site" },
      ]
    },
    {
      head: "Site Initiation Visit",
      details: [
        {id: 0, subtitle: "Preparing for SIV" },
        {id: 1, subtitle: "Performing SIV" },
        //{id: 2, subtitle: "Provide written SIV Report" },
        //{id: 3, subtitle: "Travel to the Site" },
      ]
    }
  ],
  DM: [
    {
      head: "Data Management & Statistics Plan Development",
      details: [
        {id: 0, subtitle: "test Preparing for SQV" },
        {id: 1, subtitle: "test Performing SQV" },
        //{id: 2, subtitle: "Provide written SQV Report" },
        //{id: 3, subtitle: "Travel to the Site" },
      ]
    },
    {
      head: "Database cleaning",
      details: [
        {id: 0, subtitle: "Interim data review"},
        {id: 1, subtitle: "Final data review"},
        //{id: 2, subtitle: "Provide written SIV Report" },
        //{id: 3, subtitle: "Travel to the Site" },
      ]
    }
  ],
  
}


    //{id: 0, subtitle: ["Preparing for SQV", "Performing SQV", "Provide written SQV Report", "Travel to the Site"]},
    //{id: 1, title: "Site Initiation Visit", subtitle: ["Preparing for SIV", "Performing SIV", "Provide written SIV Report", "Travel to the Site"]},
    //{id: 2, title: "Site Monitoring Visit", subtitle: ["Preparing for SMV", "Performing SMV", "Provide written SMV Report", "Travel to the Site"]},
    //{id: 3, title: "Site Close-out Visit", subtitle: ["Preparing for SCoV", "Performing SCoV", "Provide written SCoV Report", "Travel to the Site"]},


//export const taskObject = {
    //CLN: {
        //tasks: [
            //{
                //id: 0,
                //title: "Site Qualification Visit",
                //details: [
                    //{id: 0, subtitle: "Preparing for SQV"},
                    //{id: 1, subtitle: "Performing SQV"},
                    //{id: 2, subtitle: "Provide written SQV Report"},
                    //{id: 3, subtitle: "Travel to the Site"},
                //]
            //},
            //{
                //id: 1,
                //title: "Site Initiation Visit",
                //details: [
                    //{id: 0, subtitle: "Preparing for SIV"},
                    //{id: 1, subtitle: "Performing SIV"},
                    //{id: 2, subtitle: "Provide written SIV Report"},
                    //{id: 3, subtitle: "Travel to the Site"},
                //]
            //},
            //{
                //id: 2,
                //title: "Site Monitoring Visit",
                //details: [
                    //{id: 0, subtitle: "Preparing for SMV"},
                    //{id: 1, subtitle: "Performing SMV"},
                    //{id: 2, subtitle: "Provide written SMV Report"},
                    //{id: 3, subtitle: "Travel to the Site"},
                //]
            //},
            //{
                //id: 3,
                //title: "Site Close-out Visit",
                //details: [
                    //{id: 0, subtitle: "Preparing for SCoV"},
                    //{id: 1, subtitle: "Performing SCoV"},
                    //{id: 2, subtitle: "Provide written SCoV Report"},
                    //{id: 3, subtitle: "Travel to the Site"},
                //]
            //}
        //]
    //},
    //DM: {
        //tasks: [
            //{
                //id: 0,
                //title: "Data Management & Statistics Plan Development",
                //details: [
                    //{id: 0, subtitle: "test Preparing for SQV"},
                    //{id: 1, subtitle: "test Performing SQV"},
                    //{id: 2, subtitle: "test Provide written SQV Report"},
                    //{id: 3, subtitle: "test Travel to the Site"},
                //]
            //},
            //{
                //id: 1,
                //title: "Database cleaning",
                //details: [
                    //{id: 0, subtitle: "Interim data review"},
                    //{id: 1, subtitle: "Final data review"},
                //]
            //},
        //]
    //}
//};
