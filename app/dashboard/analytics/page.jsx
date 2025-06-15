"use client";
import { db } from '@/app/configs';
import { jsonForms, userResponses } from '@/app/configs/schema';
import React, { useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { BarChart3, Calendar, TrendingUp, FileText, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Analytics() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all forms created by user
      const forms = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress));
      
      setFormList(forms);

      // Fetch all responses for all forms
      const formIds = forms.map(f => f.id);
      if (formIds.length > 0) {
        const responses = await db
          .select()
          .from(userResponses);
        
        // Filter responses that belong to user's forms
        const userFormResponses = responses.filter(r => formIds.includes(r.formId));
        setAllResponses(userFormResponses);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter responses by date range
  const filteredResponses = useMemo(() => {
    let filtered = allResponses;

    if (dateRange.start) {
      filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(dateRange.end));
    }

    return filtered;
  }, [allResponses, dateRange]);

  // Calculate overall analytics
  const analytics = useMemo(() => {
    const totalSubmissions = filteredResponses.length;
    const uniqueForms = new Set(filteredResponses.map(r => r.formId)).size;
    const totalForms = formList.length;
    
    // Group by date for time series
    const submissionsByDate = {};
    filteredResponses.forEach(r => {
      const date = new Date(r.createdAt).toLocaleDateString();
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    // Sort dates
    const sortedDates = Object.keys(submissionsByDate).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    // Get last 7 days for weekly view
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      last7Days.push({
        date: dateStr,
        shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: submissionsByDate[dateStr] || 0
      });
    }

    // Form-wise submission count
    const formSubmissions = {};
    filteredResponses.forEach(r => {
      formSubmissions[r.formId] = (formSubmissions[r.formId] || 0) + 1;
    });

    const formStats = formList.map(form => {
      let title = 'Untitled Form';
      try {
        const parsed = typeof form.jsonform === 'string' 
          ? JSON.parse(form.jsonform) 
          : form.jsonform || {};
        title = parsed.form_title || title;
      } catch (e) {}
      
      return {
        id: form.id,
        title,
        submissions: formSubmissions[form.id] || 0
      };
    }).sort((a, b) => b.submissions - a.submissions);

    return {
      totalSubmissions,
      totalForms,
      activeForms: uniqueForms,
      avgPerForm: totalForms > 0 ? Math.round(totalSubmissions / totalForms) : 0,
      last7Days,
      formStats
    };
  }, [filteredResponses, formList]);

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (formList.length === 0) {
    return (
      <div className="p-10">
        <h2 className="font-bold text-3xl mb-6">Analytics</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h3 className="text-xl font-semibold mb-2">No Forms Yet</h3>
          <p className="text-muted-foreground">Create your first form to see analytics</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1);

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl mb-6">Analytics Overview</h2>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
          />
          {(dateRange.start || dateRange.end) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDateRange({ start: '', end: '' })}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Submissions</p>
              <p className="text-3xl font-bold">{analytics.totalSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Forms</p>
              <p className="text-3xl font-bold">{analytics.totalForms}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-300 to-blue-400 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Active Forms</p>
              <p className="text-3xl font-bold">{analytics.activeForms}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-200 to-blue-300 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Avg. per Form</p>
              <p className="text-3xl font-bold">{analytics.avgPerForm}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Over Time - Last 7 Days */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Last 7 Days</h3>
          </div>
          <div className="space-y-4">
            {analytics.last7Days.map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{day.shortDate}</span>
                  <span className="text-sm font-medium">{day.count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(day.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Forms */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Top Performing Forms</h3>
          </div>
          <div className="space-y-3">
            {analytics.formStats.slice(0, 7).map((form, idx) => (
              <div key={form.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{form.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${analytics.totalSubmissions > 0 
                            ? (form.submissions / analytics.totalSubmissions) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {form.submissions}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {analytics.formStats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No submissions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      {analytics.totalSubmissions > 0 && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Activity Summary</h4>
              <p className="text-sm text-muted-foreground">
                You have received <span className="font-semibold text-blue-600 dark:text-blue-400">{analytics.totalSubmissions}</span> total submissions 
                across <span className="font-semibold text-blue-600 dark:text-blue-400">{analytics.totalForms}</span> forms. 
                {analytics.activeForms > 0 && (
                  <> Currently, <span className="font-semibold text-blue-600 dark:text-blue-400">{analytics.activeForms}</span> {analytics.activeForms === 1 ? 'form has' : 'forms have'} active responses.</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
