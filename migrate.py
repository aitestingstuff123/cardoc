import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original = content

    # Special logic for server.ts prompt
    if filepath.endswith('server.ts'):
        content = content.replace('isDogOrCat', 'isVehicleOrPart')
        content = content.replace('Identify if there is a dog or cat in this media and analyze their behavior.', 'Identify if there is a vehicle or car part in this media and analyze the diagnostic issue.')
        content = content.replace('professional animal behaviorist specializing ONLY in canine (dog) and feline (cat) behavior. Your goal is to provide accurate, empathetic, and actionable insights based on pet behavior footage.', 'Master ASE Certified Mechanic specializing in automotive diagnostics. Your goal is to provide accurate, professional, and actionable insights based on vehicle diagnostic footage.')
        content = content.replace('trainingChallenge', 'maintenancePlan')
        content = content.replace('7-Day Training Challenge', 'Step-by-Step Diagnostic Checklist')
        content = content.replace('petContext', 'vehicleContext')
        # General replacements for server.ts
        content = content.replace('pet', 'vehicle')
        content = content.replace('Pet', 'Vehicle')
        content = content.replace('pets', 'vehicles')
        content = content.replace('Pets', 'Vehicles')
        content = content.replace('dog', 'car')
        content = content.replace('Dog', 'Car')
        content = content.replace('cat', 'truck')
        content = content.replace('Cat', 'Truck')

    else:
        # General React frontend replacements
        # Icons
        content = content.replace('Dog,', 'Car,')
        content = content.replace('Cat,', 'Wrench,')
        content = content.replace('<Dog ', '<Car ')
        content = content.replace('<Cat ', '<Wrench ')
        content = content.replace('lucide-react', 'lucide-react') # no-op just to be sure
        
        # Word replacements
        replacements = {
            'Pawsitive Behavior': 'AutoDiagnostic',
            'isDogOrCat': 'isVehicleOrPart',
            'trainingChallenge': 'maintenancePlan',
            'TrainingChallenge': 'MaintenancePlan',
            'Training Challenge': 'Maintenance Plan',
            '7-Day Training Challenge': 'Step-by-Step Diagnostic Checklist',
            'petContext': 'vehicleContext',
            'petId': 'vehicleId',
            'selectedPetId': 'selectedVehicleId',
            'selectedPetForAnalyses': 'selectedVehicleForAnalyses',
            'setPets': 'setVehicles',
            'setPet': 'setVehicle',
            'isAddingPet': 'isAddingVehicle',
            'editingPetId': 'editingVehicleId',
            'petImageFile': 'vehicleImageFile',
            'isUploadingPetImage': 'isUploadingVehicleImage',
            'newPet': 'newVehicle',
            'Pet ': 'Vehicle ',
            'pet ': 'vehicle ',
            'Pets ': 'Vehicles ',
            'pets ': 'vehicles ',
            'Pet.': 'Vehicle.',
            'pet.': 'vehicle.',
            'Pets.': 'Vehicles.',
            'pets.': 'vehicles.',
            'Pet,': 'Vehicle,',
            'pet,': 'vehicle,',
            'Pets,': 'Vehicles,',
            'pets,': 'vehicles,',
            'Pet?': 'Vehicle?',
            'pet?': 'vehicle?',
            "'pet'": "'vehicle'",
            "'pets'": "'vehicles'",
            '"pet"': '"vehicle"',
            '"pets"': '"vehicles"',
            'pet:': 'vehicle:',
            'pets:': 'vehicles:',
            'pets}': 'vehicles}',
            'pet}': 'vehicle}',
            'pets)': 'vehicles)',
            'pet)': 'vehicle)',
            '{pet}': '{vehicle}',
            '{pets}': '{vehicles}',
            'pet-': 'vehicle-',
            'pets-': 'vehicles-',
            '/pets': '/vehicles',
            '/pet': '/vehicle',
            'species:': 'make:',
            'breed:': 'model:',
            'age:': 'year:',
            'personality:': 'mileage:',
            'diet:': 'engine:',
            'vaccinations:': 'transmission:',
            'Species': 'Make',
            'Breed': 'Model',
            'Age': 'Year',
            'Personality': 'Mileage',
            'Diet': 'Engine',
            'Vaccinations': 'Transmission'
        }
        for k, v in replacements.items():
            content = content.replace(k, v)

        # RegEx for any stray pet/pets
        content = re.sub(r'\bpet\b', 'vehicle', content)
        content = re.sub(r'\bPet\b', 'Vehicle', content)
        content = re.sub(r'\bpets\b', 'vehicles', content)
        content = re.sub(r'\bPets\b', 'Vehicles', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.html', '.md')):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    replace_in_file("server.ts")
    process_directory("src")
    print("Done")
