echo "Switching to branch master" git checkout master
echo "Building app..."
npm run build
echo "Deploying files to serevr..."
scp -r dist/ priyanshu@31.97.227.221:/var/www/regalestateconsultants.com/
echo "Done!"