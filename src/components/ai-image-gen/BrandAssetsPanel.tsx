import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiLoader, FiX, FiUpload, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  imageGenService,
  BrandAssets,
  BrandAssetProductImage,
} from "../../services/imageGenService";
import LoadingSpinner from "../LoadingSpinner";

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function hasSavedBrandAssets(assets: BrandAssets | null): boolean {
  if (!assets) return false;
  return !!(
    assets.logo?.url ||
    (assets.colors && assets.colors.length > 0) ||
    (assets.fonts && assets.fonts.length > 0) ||
    (assets.productImages && assets.productImages.length > 0) ||
    (assets.visualStyle && assets.visualStyle.trim())
  );
}

interface BrandAssetsPanelProps {
  onChange?: (assets: BrandAssets | null) => void;
}

const BrandAssetsPanel: React.FC<BrandAssetsPanelProps> = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("#DC2626");

  const [fonts, setFonts] = useState<string[]>([]);
  const [fontInput, setFontInput] = useState("");

  const [visualStyle, setVisualStyle] = useState("");

  const [existingProductImages, setExistingProductImages] = useState<BrandAssetProductImage[]>([]);
  const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
  const [newProductPreviews, setNewProductPreviews] = useState<string[]>([]);

  const applyAssets = (assets: BrandAssets) => {
    setLogoUrl(assets.logo?.url || null);
    setColors(assets.colors || []);
    setFonts(assets.fonts || []);
    setVisualStyle(assets.visualStyle || "");
    setExistingProductImages(assets.productImages || []);
  };

  useEffect(() => {
    imageGenService
      .getBrandAssets()
      .then((res: any) => {
        if (res.success && res.data) {
          applyAssets(res.data);
          onChange?.(res.data);
        }
      })
      .catch(() => {
        // No saved brand assets yet — leave defaults
      })
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setRemoveLogo(false);
    setLogoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleAddColor = () => {
    const value = colorInput.trim();
    if (!HEX_RE.test(value)) {
      toast.error("Enter a valid hex color, e.g. #DC2626");
      return;
    }
    if (colors.length >= 10) {
      toast.error("Up to 10 brand colors");
      return;
    }
    if (colors.some((c) => c.toLowerCase() === value.toLowerCase())) return;
    setColors((prev) => [...prev, value]);
  };

  const handleAddFont = () => {
    const value = fontInput.trim();
    if (!value) return;
    if (fonts.length >= 5) {
      toast.error("Up to 5 brand fonts");
      return;
    }
    if (fonts.includes(value)) return;
    setFonts((prev) => [...prev, value]);
    setFontInput("");
  };

  const handleProductFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const room = 8 - existingProductImages.length - newProductFiles.length;
    if (room <= 0) {
      toast.error("Up to 8 product images");
      return;
    }
    const toAdd = files.slice(0, room);
    setNewProductFiles((prev) => [...prev, ...toAdd]);
    setNewProductPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const hasAnyAssets = !!(
    logoUrl || logoFile || colors.length || fonts.length || existingProductImages.length || newProductFiles.length || visualStyle.trim()
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("colors", JSON.stringify(colors));
      formData.append("fonts", JSON.stringify(fonts));
      formData.append("visualStyle", visualStyle);
      formData.append("existingProductImages", JSON.stringify(existingProductImages.map((p) => p.url)));
      if (logoFile) formData.append("logo", logoFile);
      if (removeLogo) formData.append("removeLogo", "true");
      newProductFiles.forEach((f) => formData.append("productImages", f));

      const res: any = await imageGenService.saveBrandAssets(formData);
      if (res.success && res.data) {
        applyAssets(res.data);
        setLogoFile(null);
        setLogoPreview(null);
        setRemoveLogo(false);
        setNewProductFiles([]);
        setNewProductPreviews([]);
        onChange?.(res.data);
        toast.success("Brand assets saved");
      } else {
        toast.error(res.error || res.message || "Failed to save brand assets");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save brand assets");
    } finally {
      setSaving(false);
    }
  };

  const displayedLogo = logoPreview || (!removeLogo ? logoUrl : null);

  return (
    <div className="mb-6 border border-[#242424] rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#161616] hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-sm font-semibold text-white">
          Brand Assets{" "}
          {hasAnyAssets ? (
            <span className="text-emerald-400 font-normal">· saved</span>
          ) : (
            <span className="text-gray-500 font-normal">· optional</span>
          )}
        </span>
        {open ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
      </button>

      {open && (
        <div className="p-4 sm:p-5 bg-[#101010] space-y-5">
          {!loaded ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 -mt-1">
                Save your logo, brand colors, fonts, and product photos once — then toggle
                "Apply brand assets" when generating to keep results on-brand.
              </p>

              {/* Logo */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#1A1A1A] border border-[#2a2a2a] flex items-center justify-center overflow-hidden shrink-0">
                    {displayedLogo ? (
                      <img src={displayedLogo} alt="Brand logo" className="w-full h-full object-contain" />
                    ) : (
                      <FiUpload className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 text-xs bg-[#242424] hover:bg-[#2a2a2a] text-white px-3 py-2 rounded-lg transition-colors">
                    <FiUpload className="w-3.5 h-3.5" />
                    {displayedLogo ? "Replace" : "Upload"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoSelect} />
                  </label>
                  {displayedLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                        setRemoveLogo(true);
                      }}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brand Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2a2a2a] rounded-full pl-1.5 pr-2 py-1 text-xs text-gray-200"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                      {c}
                      <button type="button" onClick={() => setColors((prev) => prev.filter((x) => x !== c))} aria-label={`Remove ${c}`}>
                        <FiX className="w-3 h-3 text-gray-500 hover:text-red-400" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={/^#([0-9a-f]{6})$/i.test(colorInput) ? colorInput : "#DC2626"}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-[#2a2a2a] bg-transparent cursor-pointer"
                    aria-label="Pick a brand color"
                  />
                  <input
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="#DC2626"
                    className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 w-28"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="inline-flex items-center gap-1 text-xs bg-[#242424] hover:bg-[#2a2a2a] text-white px-2.5 py-2 rounded-lg transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Fonts */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Fonts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {fonts.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2a2a2a] rounded-full pl-3 pr-2 py-1 text-xs text-gray-200">
                      {f}
                      <button type="button" onClick={() => setFonts((prev) => prev.filter((x) => x !== f))} aria-label={`Remove ${f}`}>
                        <FiX className="w-3 h-3 text-gray-500 hover:text-red-400" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={fontInput}
                    onChange={(e) => setFontInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFont();
                      }
                    }}
                    placeholder="e.g. Poppins, bold sans-serif"
                    className="flex-1 bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFont}
                    className="inline-flex items-center gap-1 text-xs bg-[#242424] hover:bg-[#2a2a2a] text-white px-2.5 py-2 rounded-lg transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Visual style */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Visual Style Notes</label>
                <textarea
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value.slice(0, 1000))}
                  placeholder="e.g. minimalist, high-contrast, clean product photography, bold headlines"
                  rows={2}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
                />
              </div>

              {/* Product images */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Images</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                  {existingProductImages.map((p) => (
                    <div key={p.url} className="relative aspect-square rounded-lg overflow-hidden border border-[#2a2a2a] group">
                      <img src={p.url} alt={p.name || "Product"} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingProductImages((prev) => prev.filter((x) => x.url !== p.url))}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove product image"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newProductPreviews.map((src, i) => (
                    <div key={src} className="relative aspect-square rounded-lg overflow-hidden border border-[#2a2a2a] group">
                      <img src={src} alt="New product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewProductFiles((prev) => prev.filter((_, idx) => idx !== i));
                          setNewProductPreviews((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove product image"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {existingProductImages.length + newProductFiles.length < 8 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-[#2a2a2a] hover:border-gray-500 flex items-center justify-center cursor-pointer transition-colors">
                      <FiPlus className="w-4 h-4 text-gray-500" />
                      <input type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={handleProductFiles} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                {saving && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
                Save Brand Assets
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandAssetsPanel;
