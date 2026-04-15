# Whoop Analytics

This is a small project to analyze your Whoop Data Export and give you an overall analysis of your data so far.

## Adding the data

In your Whoop App go to:
Device More >> App Settings >> Data Export

After requesting your Data Export you should get it via Email. You can then add the whole folder to the project.

## Starting the Project

docker build -t whoop-dashboard .

docker run -p 3000:3000 whoop-dashboard
