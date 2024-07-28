Project by Zachary Thurston.

For Data Visualization (CS 416)



The narrative visualization should follow one of the three effective narrative visualization structures:

- a martini glass, where the message is delivered without allowing user exploration until the end,

- an interactive slideshow, where user exploration is allowed at some or all of the steps of the story, or

- a drill down story. which presents an overview and allows the user to explore different storylines from there.


The narrative visualization should be built with scenes, annotations, parameters, and triggers.

- The scenes should follow a template for visual consistency and follow an order to best convey the message. 
  One way to implement different scenes is to make each a separate web page. 
  Another way is to use d3.select(id).html = "" to clear the contents of a container element (e.g. an SVG element) 
  and then repopulate that element using .append().

- The annotations should follow a template for visual consistency from scene to scene. 
  These annotations should also highlight and reinforce specific data items or trends 
  that make the important points for the desired messaging of the narrative visualization. 
  The lessons on d3 popups can be helpful on how to to make and place annotations, 
  but as an annotation, they should appear as part of the scene and not have to wait for a mouseover event.

- The parameters are the state variables of your narrative visualization. 
  Your narrative visualization should use these parameters to control the construction of scenes. 
  These parameters will be key variables in your JavaScript code, as well as parameters to key functions used to set up each scene.

- The triggers connect user interface actions to changes in parameters that change the state of the narrative visualization. 
  These triggers can be event listeners (callback functions) that change parameter values and then update the display to reflect 
  the result of the event.

This assignment can be successfully completed using as few as three scenes. 
Those three scenes can simply highlight different details or different data from the same chart. 
That chart can also be one of the charts we have previously used as an example (e.g. the scatterplot of 2017 automobile data). 
You can use any dataset you would like, or one of the datasets we have used previously. 
Free-form user interaction can be as simple as tooltip popups that allow the user to see more information on data items. 
Just be sure to indicate when a user can access these tooltips, and make sure this free-form user interaction fits properly 
into the narrative visualization structure.

RUBRIC: 

Functioning website with a narrative visualization [30 points]

Messaging. [10 points] What is the message you are trying to communicate with the narrative visualization?

Narrative Structure. [10 points] Which structure was your narrative visualization designed to follow 
(martini glass, interactive slide show or drop-down story)? 
How does your narrative visualization follow that structure? 
(All of these structures can include the opportunity to "drill-down" and explore. 
The difference is where that opportunity happens in the structure.)

Visual Structure. [10 points] What visual structure is used for each scene? 
How does it ensure the viewer can understand the data and navigate the scene? 
How does it highlight to urge the viewer to focus on the important parts of the data in each scene? 
How does it help the viewer transition to other scenes, to understand how the data connects to the data in other scenes?

Scenes. [10 points] What are the scenes of your narrative visualization?  How are the scenes ordered, and why?

Annotations. [10 points] What template was followed for the annotations, and why that template? 
How are the annotations used to support the messaging? Do the annotations change within a single scene, and if so, how and why

Parameters. [10 points] What are the parameters of the narrative visualization? 
What are the states of the narrative visualization? How are the parameters used to define the state and each scene?

Triggers. [10 points] What are the triggers that connect user actions to changes of state in the narrative visualization? 
What affordances are provided to the user to communicate to them what options are available to them in the narrative visualization?


Helpful campuswire posts:
https://campuswire.com/c/G3805587C/feed/739