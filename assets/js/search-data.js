// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-homepage",
    title: "Homepage",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-news",
          title: "News",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Selected research and engineering projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Publications in reverse-chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "HE Tianlun (Allen) — academic CV.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/plotly/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/photo-gallery/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/giscus-comments/";
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-joined-hkust-integrative-systems-and-design-isd-with-a-minor-in-robotics-入读香港科技大学-综合系统与设计-isd-专业-辅修机器人方向",
          title: '🎓 Joined HKUST, Integrative Systems and Design (ISD) with a Minor in Robotics.🎓...',
          description: "",
          section: "News",},{id: "news-️-joined-hkust-robomaster-team-enterprize-as-a-mechanical-member-2023-2025-️-加入-hkust-robomaster-enterprize-战队-担任机械成员-2023-2025",
          title: '🛠️ Joined HKUST RoboMaster Team ENTERPRIZE as a mechanical member (2023 – 2025).🛠️...',
          description: "",
          section: "News",},{id: "news-won-the-champion-title-of-robomaster-2024-rmuc-international-region-with-hkust-team-enterprize-与-hkust-enterprize-战队夺得-robomaster-2024-rmuc-国际赛区冠军",
          title: '🥇 Won the Champion title of RoboMaster 2024 RMUC International Region with HKUST...',
          description: "",
          section: "News",},{id: "news-awarded-the-hksar-government-scholarship-fund-talent-development-scholarship-2024-25-获香港特别行政区政府奖学基金-talent-development-scholarship-2024-25-学年",
          title: '🎓 Awarded the HKSAR Government Scholarship Fund — Talent Development Scholarship (2024/25).🎓 获香港特别行政区政府奖学基金...',
          description: "",
          section: "News",},{id: "news-won-the-champion-title-of-robomaster-2025-university-league-with-hkust-team-enterprize-与-hkust-enterprize-战队夺得-robomaster-2025-高校联盟赛冠军",
          title: '🏆 Won the Champion title of RoboMaster 2025 University League with HKUST Team...',
          description: "",
          section: "News",},{id: "news-joined-the-undergraduate-research-program-on-hydraulic-soft-robotic-arms-under-the-supervision-of-prof-rob-加入-rob-教授指导的本科生研究计划-参与液压软体机械臂课题",
          title: '🤖 Joined the Undergraduate Research Program on hydraulic soft robotic arms under the...',
          description: "",
          section: "News",},{id: "news-started-memory-augmented-vla-urp-project-designing-a-subtask-aware-framework-with-vae-based-compression-for-long-horizon-manipulation-targeting-icra-2027-启动记忆增强-vla-本科生研究计划-基于-vae-的子任务压缩框架-缓解长时序任务的上下文爆炸-计划投稿-icra-2027",
          title: '🚀 Started Memory-Augmented VLA (URP project) — designing a subtask-aware framework with VAE-based...',
          description: "",
          section: "News",},{id: "news-our-paper-embodied-4d-world-model-for-robotic-manipulation-has-been-accepted-to-icml-2026-arxiv-论文-embodied-4d-world-model-for-robotic-manipulation-被-icml-2026-接收-arxiv",
          title: '🎉 Our paper Embodied 4D World Model for Robotic Manipulation has been accepted...',
          description: "",
          section: "News",},{id: "projects-magnetic-mechanism磁力机构",
          title: 'Magnetic Mechanism磁力机构',
          description: "Mechanism-design course project — magnetic actuator design and prototype.机械设计课程项目 — 磁力执行机构方案与样机。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_magnetic/";
            },},{id: "projects-bionic-fish仿生鱼",
          title: 'Bionic Fish仿生鱼',
          description: "Course project — biologically-inspired underwater swimmer with built prototype.课程项目 — 仿生水下游动机器人，含完整实物样机。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_bionic-fish/";
            },},{id: "projects-6-dof-underwater-autonomous-robot6-自由度水下自主导航机器人",
          title: '6-DOF Underwater Autonomous Robot6 自由度水下自主导航机器人',
          description: "Full-stack — mechanical, embedded cascade PID, and YOLO-based underwater perception.全栈开发 — 机械结构、嵌入式级联 PID 控制、基于 YOLO 的水下感知。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_submarine/";
            },},{id: "projects-rfid-smart-reagent-cabinet智能-rfid-试剂柜",
          title: 'RFID Smart Reagent Cabinet智能 RFID 试剂柜',
          description: "WeShareTech internship — RFID-based smart-weighing system for laboratory reagent management.WeShareTech 实习 — 基于 RFID 的实验室药剂智能称重管理系统。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_rfid-cabinet/";
            },},{id: "projects-omnidirectional-autonomous-wheelchair全向自主移动轮椅",
          title: 'Omnidirectional Autonomous Wheelchair全向自主移动轮椅',
          description: "Team-led Year-2 project — rudder-wheel chassis with LiDAR-based autonomous navigation.Year 2 团队负责人项目 — 舵轮底盘 + 激光雷达自主导航。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_wheelchair/";
            },},{id: "projects-hkust-robomaster-enterprizehkust-robomaster-enterprize-战队",
          title: 'HKUST RoboMaster ENTERPRIZEHKUST RoboMaster Enterprize 战队',
          description: "Mechanical Department Lead — RMUC 2024 International Champion · 2025 University League Champion机械部门负责人 — RMUC 2024 国际赛区冠军 · 2025 高校联盟赛冠军",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_1_team/";
            },},{id: "projects-wheel-leg-infantry轮腿步兵",
          title: 'Wheel-leg Infantry轮腿步兵',
          description: "Custom serial-leg infantry — Best Knight Award, RMUC 2024.自研串联腿步兵 — RMUC 2024 最佳骑士奖。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_2_wheelleg/";
            },},{id: "projects-sentry-77-号哨兵",
          title: 'Sentry #77 号哨兵',
          description: "Auto-targeting sentry robot — mechanical design.自动瞄准哨兵机器人 — 机械设计。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_3_sentry7/";
            },},{id: "projects-dual-head-sentry双头哨兵",
          title: 'Dual-head Sentry双头哨兵',
          description: "Twin-turret sentry variant — newest iteration.双炮塔哨兵新一代 — 最新迭代。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_4_dualsentry/";
            },},{id: "projects-rudder-wheel-infantry舵轮步兵",
          title: 'Rudder-wheel Infantry舵轮步兵',
          description: "Steering-wheel-driven infantry chassis.舵轮驱动步兵底盘。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_5_rudder/";
            },},{id: "projects-drone-66-号无人机",
          title: 'Drone #66 号无人机',
          description: "Quadcopter aerial unit for combat support.作战支援四旋翼无人机。",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rm_6_drone/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%74%68%65%61%6A@%63%6F%6E%6E%65%63%74.%75%73%74.%68%6B", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Allenhetl", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
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
