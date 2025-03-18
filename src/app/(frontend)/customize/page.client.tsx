'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useCart } from '@/providers/Cart'
import Link from 'next/link'

interface CustomizeClientProps {
  baseHats: any[]
  customizationOptions: any[]
}

const CustomizeClient: React.FC<CustomizeClientProps> = ({ baseHats, customizationOptions }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { addToCart, cart } = useCart()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for base hat selection
  const [selectedBaseHat, setSelectedBaseHat] = useState<any>(
    baseHats.length > 0 ? baseHats[0] : null,
  )
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')

  // State for customization options
  const [selectedCustomizations, setSelectedCustomizations] = useState<any[]>([])
  const [currentCustomizationCategory, setCurrentCustomizationCategory] = useState<any>(null)
  const [customizationMode, setCustomizationMode] = useState<'predefined' | 'freeform'>(
    'predefined',
  )
  const [selectedPredefinedOption, setSelectedPredefinedOption] = useState<any>(null)
  const [customizationPlacement, setCustomizationPlacement] = useState<string>('front')
  const [customizationColor, setCustomizationColor] = useState<string>('')
  const [customizationSize, setCustomizationSize] = useState<string>('')

  // State for custom content
  const [customText, setCustomText] = useState<string>('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [additionalNotes, setAdditionalNotes] = useState<string>('')

  // Filtered options
  const [filteredCustomizationOptions, setFilteredCustomizationOptions] = useState<any[]>([])

  // Add these new states
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addToCartMessage, setAddToCartMessage] = useState('')
  const [showCartButton, setShowCartButton] = useState(false)

  useEffect(() => {
    setHeaderTheme('light')

    // Set default values when base hat changes
    if (selectedBaseHat) {
      if (selectedBaseHat.available_colors && selectedBaseHat.available_colors.length > 0) {
        setSelectedColor(selectedBaseHat.available_colors[0].color_name)
      }

      if (selectedBaseHat.size_options && selectedBaseHat.size_options.length > 0) {
        setSelectedSize(selectedBaseHat.size_options[0].size)
      }

      // Filter customization options based on hat type compatibility
      filterCustomizationOptions(selectedBaseHat.hat_type)
    }
  }, [selectedBaseHat, setHeaderTheme])

  useEffect(() => {
    // When customization category changes, update predefined options and mode
    if (currentCustomizationCategory) {
      if (currentCustomizationCategory.customization_mode === 'predefined') {
        setCustomizationMode('predefined')
      } else if (currentCustomizationCategory.customization_mode === 'freeform') {
        setCustomizationMode('freeform')
      } else {
        // Default to predefined when both are available
        setCustomizationMode('predefined')
      }

      // Set default predefined option if available
      if (
        currentCustomizationCategory.predefined_options &&
        currentCustomizationCategory.predefined_options.length > 0
      ) {
        setSelectedPredefinedOption(currentCustomizationCategory.predefined_options[0])
      } else {
        setSelectedPredefinedOption(null)
      }
    }
  }, [currentCustomizationCategory])

  const filterCustomizationOptions = (hatType: string) => {
    const filtered = customizationOptions.filter(
      (option) => option.compatible_hat_types && option.compatible_hat_types.includes(hatType),
    )
    setFilteredCustomizationOptions(filtered)

    if (filtered.length > 0 && !currentCustomizationCategory) {
      setCurrentCustomizationCategory(filtered[0])

      // Set default values for the customization
      if (filtered[0].placement_options && filtered[0].placement_options.length > 0) {
        setCustomizationPlacement(filtered[0].placement_options[0])
      }
    }
  }

  const handleBaseHatChange = (baseHatId: string) => {
    const baseHat = baseHats.find((hat) => hat.id === baseHatId) || null
    setSelectedBaseHat(baseHat)
  }

  const handleCustomizationCategoryChange = (customizationId: string) => {
    const customization =
      filteredCustomizationOptions.find((option) => option.id === customizationId) || null
    setCurrentCustomizationCategory(customization)

    // Reset customization values
    if (customization) {
      if (customization.placement_options && customization.placement_options.length > 0) {
        setCustomizationPlacement(customization.placement_options[0])
      }

      // Reset customization-specific inputs
      setCustomText('')
      setUploadedImage(null)
      setAdditionalNotes('')
    }
  }

  const handlePredefinedOptionChange = (optionId: string) => {
    if (!currentCustomizationCategory || !currentCustomizationCategory.predefined_options) return

    const option = currentCustomizationCategory.predefined_options.find(
      (opt: any) => opt.id === optionId,
    )
    setSelectedPredefinedOption(option)

    // Set default color and size if available
    if (option) {
      if (option.color_options && option.color_options.length > 0) {
        setCustomizationColor(option.color_options[0].color_name)
      }

      if (option.size_options && option.size_options.length > 0) {
        setCustomizationSize(option.size_options[0].size)
      }
    }
  }

  const handleCustomizationModeChange = (mode: 'predefined' | 'freeform') => {
    setCustomizationMode(mode)

    // Reset inputs when changing modes
    setCustomText('')
    setUploadedImage(null)
    setAdditionalNotes('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const addCustomization = () => {
    if (!currentCustomizationCategory) return

    // Calculate price for this customization
    let price = currentCustomizationCategory.base_price

    if (customizationMode === 'predefined' && selectedPredefinedOption) {
      price += selectedPredefinedOption.additional_cost || 0

      // Add color cost if applicable
      if (customizationColor && selectedPredefinedOption.color_options) {
        const colorOption = selectedPredefinedOption.color_options.find(
          (color: any) => color.color_name === customizationColor,
        )
        if (colorOption && colorOption.additional_cost) {
          price += colorOption.additional_cost
        }
      }

      // Add size cost if applicable
      if (customizationSize && selectedPredefinedOption.size_options) {
        const sizeOption = selectedPredefinedOption.size_options.find(
          (size: any) => size.size === customizationSize,
        )
        if (sizeOption && sizeOption.additional_cost) {
          price += sizeOption.additional_cost
        }
      }
    } else if (customizationMode === 'freeform' && currentCustomizationCategory.freeform_settings) {
      price += currentCustomizationCategory.freeform_settings.additional_cost || 0
    }

    const newCustomization = {
      category: currentCustomizationCategory,
      type: customizationMode,
      predefinedOption: selectedPredefinedOption,
      placement: customizationPlacement,
      color: customizationColor,
      size: customizationSize,
      customText: customText,
      customImage: uploadedImage,
      notes: additionalNotes,
      price: price,
    }

    setSelectedCustomizations([...selectedCustomizations, newCustomization])

    // Reset customization inputs
    setCustomText('')
    setUploadedImage(null)
    setAdditionalNotes('')
  }

  const removeCustomization = (index: number) => {
    const updatedCustomizations = [...selectedCustomizations]
    updatedCustomizations.splice(index, 1)
    setSelectedCustomizations(updatedCustomizations)
  }

  const calculateTotalPrice = () => {
    if (!selectedBaseHat) return 0

    // Base price
    let total = selectedBaseHat.base_price

    // Add size cost if applicable
    if (selectedSize && selectedBaseHat.size_options) {
      const sizeOption = selectedBaseHat.size_options.find(
        (size: any) => size.size === selectedSize,
      )
      if (sizeOption && sizeOption.additional_cost) {
        total += sizeOption.additional_cost
      }
    }

    // Add customization costs
    selectedCustomizations.forEach((customization) => {
      total += customization.price || 0
    })

    return total.toFixed(2)
  }

  const handleAddToCart = () => {
    if (!selectedBaseHat || selectedCustomizations.length === 0) {
      setAddToCartMessage('Please add at least one customization before adding to cart')
      setTimeout(() => setAddToCartMessage(''), 3000)
      return
    }

    setIsAddingToCart(true)

    try {
      // Get the current timestamp for unique IDs
      const timestamp = Date.now()

      // Create a custom product object that matches the Product type expected by cart
      const customProduct = {
        id: `custom-${timestamp}`, // Generate a temporary ID
        title: `Custom ${selectedBaseHat.title}`,
        price: parseFloat(calculateTotalPrice()),
        product_type: selectedBaseHat.hat_type as 'Bucket Hat' | 'Beanie' | 'Ski Mask' | 'Other',
        quantity: 1, // Available quantity (for cart validation)
        pictures: selectedBaseHat.images || [], // Use base hat image
        description: {
          // Simple description object
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Custom designed cap' }],
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        slug: `custom-${selectedBaseHat.slug || 'cap'}-${timestamp}`,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        // Custom fields to store customization details - this won't be in the type, but we can add it
        customProduct: {
          baseHat: {
            id: selectedBaseHat.id,
            title: selectedBaseHat.title,
            hat_type: selectedBaseHat.hat_type,
          },
          selectedColor,
          selectedSize,
          customizations: selectedCustomizations.map((c) => ({
            category: { id: c.category.id, title: c.category.title },
            type: c.type,
            placement: c.placement,
            customText: c.customText,
            price: c.price,
          })),
          totalPrice: parseFloat(calculateTotalPrice()),
        },
      }

      // Add the product to cart
      addToCart(customProduct as any) // Use type assertion as a temporary solution

      // Show success message
      setAddToCartMessage('Added to cart!')
      setShowCartButton(true)
      setTimeout(() => {
        setAddToCartMessage('')
        // Don't reset the cart button visibility
      }, 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddToCartMessage('Error adding to cart. Please try again.')
      setTimeout(() => setAddToCartMessage(''), 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (!selectedBaseHat) {
    return <div className="container">No base hats available for customization</div>
  }

  return (
    <div className="container overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Base Hat Selection and Preview */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Starting Point</h2>

          <div className="mb-6">
            <label htmlFor="base-hat-select" className="block text-sm font-medium mb-2">
              Base Style
            </label>
            <select
              id="base-hat-select"
              value={selectedBaseHat.id}
              onChange={(e) => handleBaseHatChange(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {baseHats.map((hat) => (
                <option key={hat.id} value={hat.id}>
                  {hat.title}
                </option>
              ))}
            </select>
          </div>

          {selectedBaseHat.available_colors && selectedBaseHat.available_colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {selectedBaseHat.available_colors.map((color: any) => (
                  <button
                    key={color.color_name}
                    onClick={() => setSelectedColor(color.color_name)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color.color_name ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.color_value }}
                    title={color.color_name}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedBaseHat.size_options && selectedBaseHat.size_options.length > 0 && (
            <div className="mb-6">
              <label htmlFor="size-select" className="block text-sm font-medium mb-2">
                Size
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                {selectedBaseHat.size_options.map((size: any) => (
                  <option key={size.size} value={size.size}>
                    {size.size} {size.additional_cost > 0 ? `(+$${size.additional_cost})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="aspect-square relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {selectedBaseHat.images && selectedBaseHat.images.length > 0 && (
              <Image
                src={
                  typeof selectedBaseHat.images[0] === 'string'
                    ? selectedBaseHat.images[0]
                    : selectedBaseHat.images[0].url || ''
                }
                alt={selectedBaseHat.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                className="p-4"
              />
            )}

            {/* Preview customizations */}
            {selectedCustomizations.map((customization, index) => (
              <div
                key={index}
                className="absolute z-10"
                style={{
                  top:
                    customization.placement === 'top'
                      ? '25%'
                      : customization.placement === 'front'
                        ? '50%'
                        : customization.placement === 'back'
                          ? '75%'
                          : customization.placement === 'left-side'
                            ? '50%'
                            : customization.placement === 'right-side'
                              ? '50%'
                              : '50%',
                  left:
                    customization.placement === 'left-side'
                      ? '25%'
                      : customization.placement === 'right-side'
                        ? '75%'
                        : '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {customization.customText && (
                  <div
                    className="text-center p-2"
                    style={{ color: customization.color?.toLowerCase() }}
                  >
                    {customization.customText}
                  </div>
                )}

                {customization.customImage && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={customization.customImage}
                      alt="Custom image"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Customize Your Cap</h2>

          {filteredCustomizationOptions.length > 0 ? (
            <>
              <div className="mb-6">
                <label htmlFor="customization-select" className="block text-sm font-medium mb-2">
                  Choose Customization Type
                </label>
                <select
                  id="customization-select"
                  value={currentCustomizationCategory?.id || ''}
                  onChange={(e) => handleCustomizationCategoryChange(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  {filteredCustomizationOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title} - ${option.base_price}
                    </option>
                  ))}
                </select>
              </div>

              {currentCustomizationCategory && (
                <>
                  {/* Mode selection if both are available */}
                  {currentCustomizationCategory.customization_mode === 'both' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Customization Method</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleCustomizationModeChange('predefined')}
                          className={`px-4 py-2 rounded ${
                            customizationMode === 'predefined'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          Choose from Options
                        </button>
                        <button
                          onClick={() => handleCustomizationModeChange('freeform')}
                          className={`px-4 py-2 rounded ${
                            customizationMode === 'freeform'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          Custom Design
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Predefined Options */}
                  {customizationMode === 'predefined' &&
                    currentCustomizationCategory.predefined_options &&
                    currentCustomizationCategory.predefined_options.length > 0 && (
                      <div className="mb-6">
                        <label
                          htmlFor="predefined-select"
                          className="block text-sm font-medium mb-2"
                        >
                          Select Option
                        </label>
                        <select
                          id="predefined-select"
                          value={selectedPredefinedOption?.id || ''}
                          onChange={(e) => handlePredefinedOptionChange(e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        >
                          {currentCustomizationCategory.predefined_options.map((option: any) => (
                            <option key={option.id || option.name} value={option.id || option.name}>
                              {option.name}
                              {option.additional_cost > 0 ? ` (+$${option.additional_cost})` : ''}
                            </option>
                          ))}
                        </select>

                        {selectedPredefinedOption && selectedPredefinedOption.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {selectedPredefinedOption.description}
                          </p>
                        )}

                        {/* Show predefined option colors if available */}
                        {selectedPredefinedOption &&
                          selectedPredefinedOption.color_options &&
                          selectedPredefinedOption.color_options.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium mb-2">Color</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedPredefinedOption.color_options.map((color: any) => (
                                  <button
                                    key={color.color_name}
                                    onClick={() => setCustomizationColor(color.color_name)}
                                    className={`w-8 h-8 rounded-full border ${
                                      customizationColor === color.color_name
                                        ? 'ring-2 ring-blue-500 ring-offset-2'
                                        : ''
                                    }`}
                                    style={{ backgroundColor: color.color_value }}
                                    title={`${color.color_name}${
                                      color.additional_cost > 0
                                        ? ` (+$${color.additional_cost})`
                                        : ''
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Show predefined option sizes if available */}
                        {selectedPredefinedOption &&
                          selectedPredefinedOption.size_options &&
                          selectedPredefinedOption.size_options.length > 0 && (
                            <div className="mt-4">
                              <label
                                htmlFor="option-size"
                                className="block text-sm font-medium mb-2"
                              >
                                Size
                              </label>
                              <select
                                id="option-size"
                                value={customizationSize}
                                onChange={(e) => setCustomizationSize(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                              >
                                {selectedPredefinedOption.size_options.map((size: any) => (
                                  <option key={size.size} value={size.size}>
                                    {size.size}
                                    {size.additional_cost > 0 ? ` (+$${size.additional_cost})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                      </div>
                    )}

                  {/* Placement selection */}
                  {currentCustomizationCategory.placement_options &&
                    currentCustomizationCategory.placement_options.length > 0 && (
                      <div className="mb-6">
                        <label
                          htmlFor="placement-select"
                          className="block text-sm font-medium mb-2"
                        >
                          Placement
                        </label>
                        <select
                          id="placement-select"
                          value={customizationPlacement}
                          onChange={(e) => setCustomizationPlacement(e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        >
                          {currentCustomizationCategory.placement_options.map(
                            (placement: string) => (
                              <option key={placement} value={placement}>
                                {placement
                                  .replace('-', ' ')
                                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    )}

                  {/* Freeform customization options */}
                  {customizationMode === 'freeform' &&
                    currentCustomizationCategory.freeform_settings && (
                      <>
                        {currentCustomizationCategory.freeform_settings.allow_text && (
                          <div className="mb-6">
                            <label htmlFor="custom-text" className="block text-sm font-medium mb-2">
                              Custom Text
                            </label>
                            <textarea
                              id="custom-text"
                              value={customText}
                              onChange={(e) => setCustomText(e.target.value)}
                              placeholder="Enter custom text for this customization"
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
                              maxLength={
                                currentCustomizationCategory.freeform_settings.max_text_length ||
                                100
                              }
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum{' '}
                              {currentCustomizationCategory.freeform_settings.max_text_length ||
                                100}{' '}
                              characters
                            </p>
                          </div>
                        )}

                        {currentCustomizationCategory.freeform_settings.allow_image_upload && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Upload Image</label>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <div className="flex gap-4 items-center">
                              <button
                                onClick={triggerFileInput}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                              >
                                Choose File
                              </button>
                              <span className="text-sm text-gray-500">
                                {uploadedImage ? 'Image selected' : 'No image selected'}
                              </span>
                            </div>

                            {currentCustomizationCategory.freeform_settings
                              .image_upload_instructions && (
                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded">
                                <p className="font-medium mb-1">Image Guidelines:</p>
                                {/* Simplified instructions - would need to properly render rich text */}
                                <p>Please upload high quality images (PNG or JPG recommended).</p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                  {/* Additional notes - for all customization types */}
                  <div className="mb-6">
                    <label htmlFor="additional-notes" className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="additional-notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Add any specific instructions for this customization"
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
                    />
                  </div>

                  <button
                    onClick={addCustomization}
                    className="w-full py-2 mb-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Add This Customization
                  </button>
                </>
              )}

              {/* Current Customizations */}
              {selectedCustomizations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Current Customizations</h3>
                  <div className="space-y-4">
                    {selectedCustomizations.map((customization, index) => (
                      <div key={index} className="p-4 border rounded">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{customization.category.title}</h4>
                          <button
                            onClick={() => removeCustomization(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Type:{' '}
                          {customization.type === 'predefined' ? 'Pre-designed' : 'Custom Design'}
                        </p>
                        {customization.type === 'predefined' && customization.predefinedOption && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Option: {customization.predefinedOption.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Placement:{' '}
                          {customization.placement
                            .replace('-', ' ')
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        {customization.color && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Color: {customization.color}
                          </p>
                        )}
                        {customization.size && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Size: {customization.size}
                          </p>
                        )}
                        {customization.customText && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Text: &ldquo;{customization.customText}&rdquo;
                          </p>
                        )}
                        {customization.customImage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Custom image added
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Price: ${customization.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total and Add to Cart */}
              <div className="mt-8">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-xl font-bold">${calculateTotalPrice()}</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || selectedCustomizations.length === 0}
                    className={`w-full py-3 text-white rounded-md transition ${
                      selectedCustomizations.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isAddingToCart
                          ? 'bg-blue-400'
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isAddingToCart ? 'Adding to Cart...' : addToCartMessage || 'Add to Cart'}
                  </button>

                  {addToCartMessage && (
                    <p
                      className={`text-center mt-2 ${
                        addToCartMessage.includes('Error') ||
                        addToCartMessage.includes('Please add')
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {addToCartMessage}
                    </p>
                  )}

                  {showCartButton && (
                    <div className="mt-4">
                      <Link
                        href="/cart"
                        className="block text-center w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        View Cart
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded">
              No customization options available for this type of hat.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomizeClient
