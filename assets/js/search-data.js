// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Selected robotics and machine learning projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-acknowledgments",
          title: "Acknowledgments",
          description: "Research papers where I am acknowledged for contributions but not listed as an author.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/acknowledged-contributions/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Education, experience, projects, publications, certifications, and technical skills.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-social-robot-navigation",
        
          title: "Social Robot Navigation",
        
        description: "Notes on how robots should move among people",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/social-robot-navigation/";
          
        },
      },{id: "post-applying-to-phd-programs",
        
          title: "Applying to PhD Programs",
        
        description: "Notes on the PhD application process",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/applying-to-phd/";
          
        },
      },{id: "projects-sample-efficient-rl-with-expert-data-augmentation",
          title: 'Sample-Efficient RL with Expert Data Augmentation',
          description: "Using expert demonstrations to cut the number of environment steps PPO needs on LunarLander-v2.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/dapg/";
            },},{id: "projects-prints-on-the-go",
          title: 'Prints On The Go',
          description: "Upload a document from your phone, and the photocopy shop&#39;s printer prints it with nobody at the counter.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/potg/";
            },},{id: "projects-12-dof-quadruped-robot",
          title: '12-DOF Quadruped Robot',
          description: "A four-legged walking robot we designed in SolidWorks, 3D-printed, wired up, and controlled over Wi-Fi from a Python GUI.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/quadruped/";
            },},{id: "projects-scene-and-social-awareness-in-trajectory-prediction",
          title: 'Scene and Social Awareness in Trajectory Prediction',
          description: "Re-ranking a predictor&#39;s candidate futures with Direct Preference Optimization, so the planner sees safe, socially reasonable trajectories first.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/trajectory-prediction/";
            },},{id: "projects-autonomous-warehouse-pick-and-deliver-robot",
          title: 'Autonomous Warehouse Pick-and-Deliver Robot',
          description: "A TurtleBot 3 with a manipulator arm that maps a warehouse, plans a collision-free route with RRT*, and follows it in Gazebo.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/warehouse/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Shubham_Derhgawen_Resume.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%73%64%65%72%68%30%30%31@%75%63%72.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Shubhamd13", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/shubham-d-021a56186", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
