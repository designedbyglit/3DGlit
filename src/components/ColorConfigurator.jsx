import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import Viewer3D from '@/components/Viewer3D';

const DEFAULT_COLORS = [
  '#FF4500', '#FF8C00', '#FFD700', '#32CD32', '#00CED1',
  '#1E90FF', '#8A2BE2', '#FF1493', '#FFFFFF', '#C0C0C0',
  '#808080', '#000000', '#8B4513', '#D2691E', '#F5F5DC',
];

const ColorConfigurator = forwardRef(function ColorConfigurator({ product, chosenColors, onColorChange }, ref) {
  const [selectedPart, setSelectedPart] = useState(
    product?.color_parts?.[0]?.part_name || null
  );
  const [customColor, setCustomColor] = useState('#FF4500');
  const [detectedMeshes, setDetectedMeshes] = useState([]);
  const previewRef = useRef(null);
  const viewer3DRef = useRef(null);

  const has3DModel = !!product?.model_3d_url;

  useImperativeHandle(ref, () => ({
    captureScreenshot: async () => {
      if (has3DModel && viewer3DRef.current) {
        return viewer3DRef.current.captureScreenshot();
      }
      if (!previewRef.current) return null;
      const canvas = await html2canvas(previewRef.current, { useCORS: true, backgroundColor: '#ffffff' });
      return canvas.toDataURL('image/png');
    }
  }));

  // For 3D mode: meshes are detected by Viewer3D
  const handleMeshesDetected = (meshNames) => {
    setDetectedMeshes(meshNames);
    if (meshNames.length > 0 && !selectedPart) {
      setSelectedPart(meshNames[0]);
    }
  };

  // Sync selected mesh from viewer clicks
  const handle3DColorChange = (colors) => {
    const { _selectedMesh, ...rest } = colors;
    if (_selectedMesh) setSelectedPart(_selectedMesh);
    // Only update if it's a real color change (not just a mesh selection event)
    if (Object.keys(rest).length > 0 || Object.keys(colors).filter(k => k !== '_selectedMesh').length > 0) {
      const cleaned = { ...chosenColors };
      Object.keys(rest).forEach(k => { cleaned[k] = rest[k]; });
      onColorChange(cleaned);
    }
  };

  const setColor = (color) => {
    if (!selectedPart) return;
    onColorChange({ ...chosenColors, [selectedPart]: color });
  };

  // 2D mode parts fallback
  const parts = product?.color_parts?.length > 0
    ? product.color_parts
    : [{ part_name: 'Pièce principale', default_color: '#FF4500' }];

  const availableColors = product?.available_colors?.length > 0
    ? product.available_colors
    : DEFAULT_COLORS;

  const getPartColor = (partName) => {
    return chosenColors[partName] || parts.find(p => p.part_name === partName)?.default_color || '#808080';
  };

  // Parts list: use detected meshes in 3D mode, color_parts in 2D mode
  const activeParts = has3DModel ? detectedMeshes : parts.map(p => p.part_name);

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      {/* Preview area */}
      {has3DModel ? (
        <div className="rounded-xl overflow-hidden border border-gray-100 mb-6" style={{ height: 360 }}>
          <Viewer3D
            ref={viewer3DRef}
            modelUrl={product.model_3d_url}
            chosenColors={chosenColors}
            onColorChange={handle3DColorChange}
            onMeshesDetected={handleMeshesDetected}
          />
        </div>
      ) : (
        <div ref={previewRef} className="bg-white rounded-xl border border-gray-100 p-8 mb-6 flex flex-col items-center justify-center min-h-64">
          {product?.image_url ? (
            <img src={product.image_url} alt={product.name} className="max-h-48 object-contain rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4 flex-wrap justify-center">
                {parts.map(part => (
                  <div
                    key={part.part_name}
                    onClick={() => setSelectedPart(part.part_name)}
                    className={`relative cursor-pointer transition-all duration-200 ${selectedPart === part.part_name ? 'scale-110' : 'hover:scale-105'}`}
                  >
                    <div
                      className="w-24 h-24 rounded-2xl shadow-md border-4 transition-all"
                      style={{
                        backgroundColor: getPartColor(part.part_name),
                        borderColor: selectedPart === part.part_name ? '#F97316' : 'transparent',
                      }}
                    />
                    <span className="absolute -bottom-5 left-0 right-0 text-center text-xs text-gray-600 font-medium truncate">
                      {part.part_name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-8">Cliquez sur une zone pour la colorer</p>
            </div>
          )}
        </div>
      )}

      {/* Part selector tabs */}
      {activeParts.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {activeParts.map(partName => (
            <button
              key={partName}
              onClick={() => setSelectedPart(partName)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                selectedPart === partName
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: chosenColors[partName] || (has3DModel ? '#808080' : getPartColor(partName)) }}
              />
              {partName}
            </button>
          ))}
        </div>
      )}

      {/* Color picker */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-gray-700">
            Couleur {selectedPart ? `— ${selectedPart}` : ''}
          </span>
          <div
            className="ml-auto w-6 h-6 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: selectedPart ? (chosenColors[selectedPart] || '#808080') : '#ccc' }}
          />
        </div>

        {/* Preset swatches */}
        <div className="flex flex-wrap gap-2 mb-3">
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => setColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                selectedPart && chosenColors[selectedPart] === color
                  ? 'border-orange-500 scale-110'
                  : 'border-white shadow-sm'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
          <input
            type="color"
            value={customColor}
            onChange={e => setCustomColor(e.target.value)}
            className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-sm text-gray-500">Couleur personnalisée</span>
          <button
            onClick={() => setColor(customColor)}
            className="ml-auto text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>

      {/* Summary */}
      {Object.keys(chosenColors).length > 0 && (
        <div className="mt-4 p-3 bg-white border border-gray-100 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Résumé des couleurs</p>
          <div className="space-y-1">
            {Object.entries(chosenColors).map(([part, color]) => (
              <div key={part} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: color }} />
                <span className="text-gray-600">{part}</span>
                <span className="ml-auto text-gray-400 text-xs font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ColorConfigurator;
