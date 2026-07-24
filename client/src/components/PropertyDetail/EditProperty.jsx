import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';                // ✅ fixed
import Button from '../common/Button';            // ✅ fixed
import { Input, Select, Textarea } from '../common/Form'; // ✅ fixed
import PageHeader from '../common/PageHeader';    // ✅ fixed
import LoadingSkeleton from '../common/LoadingSkeleton'; // ✅ fixed
import Alert from '../common/Alert';              // ✅ fixed
import { getProperty, updateProperty } from '../../services/propertyService'; // ✅ correct – 2 levels up to src/services/

// ... rest of the component unchanged

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    type: 'apartment',
    status: 'available',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: '',
  });

  // Fetch property on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getProperty(id);
        setFormData({
          name: data.name || '',
          location: data.location || '',
          price: data.price || '',
          type: data.type || 'apartment',
          status: data.status || 'available',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          area: data.area || '',
          description: data.description || '',
          amenities: data.amenities?.join(', ') || '',
        });
      } catch (err) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Convert amenities string back to array
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        area: parseFloat(formData.area),
      };
      await updateProperty(id, payload);
      navigate(`/properties/${id}`); // redirect to detail page
    } catch (err) {
      setError('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Edit Property"
        breadcrumb={[{ label: 'Properties', path: '/properties' }, { label: 'Edit' }]}
      />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Property Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Input
              label="Price ($)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <Select
              label="Property Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'apartment', label: 'Apartment' },
                { value: 'house', label: 'House' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'land', label: 'Land' },
              ]}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'pending', label: 'Pending' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
            <Input
              label="Bedrooms"
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
            />
            <Input
              label="Bathrooms"
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
            />
            <Input
              label="Area (sq ft)"
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            <Input
              label="Amenities (comma separated)"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g. Pool, Gym, Parking"
            />
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="flex flex-wrap gap-3 justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/properties/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProperty;