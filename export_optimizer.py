import bpy
import os

def optimize_and_export_gltf(filepath, export_selected=True):
    """
    Automates the optimization of meshes and exports them to glTF/glb format.
    Following the 4 rules of WebGL optimization:
    1. Apply all modifiers.
    2. Recalculate normals (make them consistent/pointing outwards).
    3. Triangulate geometry.
    4. Export to .glb with +Y Up, selected objects, normals/UVs enabled, vertex colors disabled.
    """
    # 1. Store initial selection and active object
    initial_selected = list(bpy.context.selected_objects)
    initial_active = bpy.context.active_object
    
    # Filter only mesh objects
    meshes = [obj for obj in initial_selected if obj.type == 'MESH']
    
    if not meshes:
        print("Warning: No mesh objects selected. Selecting all meshes in scene.")
        meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
        for obj in meshes:
            obj.select_set(True)
            
    if not meshes:
        print("Error: No meshes found in the scene to optimize and export.")
        return False
        
    print(f"Starting optimization of {len(meshes)} meshes...")
    
    # Make sure we are in object mode to start
    if bpy.ops.object.mode_set.poll():
        bpy.ops.object.mode_set(mode='OBJECT')
        
    for obj in meshes:
        # Set active object
        bpy.context.view_layer.objects.active = obj
        
        # 1. Apply Modifiers
        print(f"-> Applying all modifiers for: {obj.name}")
        # Convert to mesh is the cleanest way to apply all modifiers in Blender API
        bpy.ops.object.convert(target='MESH')
        
        # 2. Recalculate Normals (pointing outwards)
        print(f"-> Recalculating normals (Shift+N) for: {obj.name}")
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        
        # 3. Triangulation
        print(f"-> Triangulating geometry for: {obj.name}")
        tri_mod = obj.modifiers.new(name="Auto_Triangulate", type='TRIANGULATE')
        bpy.ops.object.modifier_apply(modifier=tri_mod.name)
        
    # Restore selection specifically for the export command
    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    if meshes:
        bpy.context.view_layer.objects.active = meshes[0]
        
    # Ensure export directory exists
    output_dir = os.path.dirname(filepath)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Exporting optimized meshes to: {filepath}")
    
    # 4. Configure glTF Export Settings according to guidelines
    try:
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            export_format='GLB',                   # glTF Binary (.glb)
            export_selected=export_selected,        # Include: Selected Objects (or active selection)
            export_apply=True,                      # Geometry -> Apply Modifiers (failsafe)
            export_yup=True,                        # Transform -> +Y Up
            export_texcoords=True,                  # Geometry -> UVs
            export_normals=True,                    # Geometry -> Normals
            export_colors=False,                    # Geometry -> Desmarcar Vertex Colors para ahorrar peso
            export_materials='EXPORT',              # Export materials using Principled BSDF mappings
            export_cameras=False,                   # Do not export cameras
            export_lights=False                     # Do not export lights
        )
        print("Optimization and Export finished successfully!")
        success = True
    except Exception as e:
        print(f"Error exporting scene: {str(e)}")
        success = False
        
    # Restore original selection state
    bpy.ops.object.select_all(action='DESELECT')
    for obj in initial_selected:
        try:
            obj.select_set(True)
        except Exception:
            pass
    if initial_active:
        try:
            bpy.context.view_layer.objects.active = initial_active
        except Exception:
            pass
            
    return success

# --- AUTOMATIC SCRIPT EXECUTION FOR CONVENIENCE ---
# To use: Change 'export_path' to your desired output file, then click 'Run Script' in Blender.
if __name__ == "__main__":
    # Get current blend file directory or default to user home directory
    blend_dir = bpy.path.abspath("//")
    if not blend_dir or blend_dir == "":
        export_path = os.path.join(os.path.expanduser("~"), "optimized_model.glb")
    else:
        blend_name = os.path.splitext(bpy.path.basename(bpy.context.blend_data.filepath))[0]
        if not blend_name:
            blend_name = "blender_export"
        export_path = os.path.join(blend_dir, f"{blend_name}_optimized.glb")
        
    print(f"Running auto-export script...")
    optimize_and_export_gltf(export_path, export_selected=True)
