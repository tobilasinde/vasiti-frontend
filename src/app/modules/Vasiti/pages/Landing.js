import React, { useEffect, useState } from 'react'
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from '../../../../_metronic/_helpers/AssetsHelpers'
import {
	createProduct,
	deleteProduct,
	fetchProducts,
	updateProduct,
} from '../redux/productsActions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Accordion, Card } from 'react-bootstrap'
// import swal from 'sweetalert'

const colors = ['danger', 'primary', 'success', 'info', 'dark', 'secondary']
export const Landing = () => {
	const [variety, setVariety] = useState(1)
	const [loading, setLoading] = useState(false)
	const [categories, setCategories] = useState([])
	const [initialFilter, setInitialFilter] = useState({
		filter: {},
		sortOrder: 'asc', // asc||desc
		sortField: 'id',
		pageNumber: 1,
		pageSize: 50,
	})
	const { currentState } = useSelector(
		(state) => ({ currentState: state.products }),
		shallowEqual,
	)
	const { entities } = currentState //you can add listLoading, totalCount
	const dispatch = useDispatch()
	useEffect(() => {
		console.log('hi')
		dispatch(fetchProducts(initialFilter))
	}, [dispatch, initialFilter])
	useEffect(() => {
		if (entities) {
			const category = new Set()
			entities.map(
				(e) => e.product_category && category.add(e.product_category),
			)
			setCategories([...category])
		}
	}, [entities])

	const ProductSchema = Yup.object().shape({
		product_name: Yup.string()
			.min(3, 'Minimum 3 symbols')
			.max(50, 'Maximum 50 symbols')
			.required('Required field'),
		product_category: Yup.string()
			.min(3, 'Minimum 3 symbols')
			.max(50, 'Maximum 50 symbols')
			.required('Required field'),
		product_description: Yup.string()
			.min(3, 'Minimum 3 symbols')
			.max(50, 'Maximum 50 symbols'),
	})
	const getInputClasses = (fieldname) => {
		if (formik.touched[fieldname] && formik.errors[fieldname]) {
			return 'is-invalid'
		}

		if (formik.touched[fieldname] && !formik.errors[fieldname]) {
			return 'is-valid'
		}

		return ''
	}
	const [initialValues, setInitialValues] = useState({
		product_name: '',
		product_category: '',
		product_description: '',
		product_varieties: [
			{
				price: '',
				size: '',
				quantity: '',
				color: '',
			},
		],
	})
	const formik = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: ProductSchema,
		onSubmit: (values, { resetForm }) => {
			setLoading(true)
			if (values.id) {
				dispatch(updateProduct(values))
					.then((r) => {
						console.log('here')
						// swal('Great', 'Product added successfully', 'success')
						setLoading(false)
						setVariety(1)
						setInitialValues({
							product_name: '',
							product_category: '',
							product_description: '',
							product_varieties: [
								{
									price: '',
									size: '',
									quantity: '',
									color: '',
								},
							],
						})
					})

					.catch((e) => {
						// swal('Oops', 'Error while adding product', 'error')
						setLoading(false)
					})
			} else {
				dispatch(createProduct(values))
					.then((r) => {
						// swal('Great', 'Product added successfully', 'success')
						setLoading(false)
						resetForm()
					})
					.catch((e) => {
						// swal('Oops', 'Error while adding product', 'error')
						setLoading(false)
					})
			}
		},
	})
	const deleteAProduct = (id) => {
		dispatch(deleteProduct(id))
			.then((r) => {
				// swal('Great', 'Product deleted successfully', 'success')
			})
			.catch((e) => {
				// swal('Oops', 'Error while deleting product', 'error')
			})
	}
	const updateAProduct = (id) => {
		const data = entities.find((e) => e.id === id)
		setVariety(data.product_varieties.length)
		console.log(data)
		console.log(variety)
		setInitialValues(data)
	}
	const searchText = (val) => {
		setInitialFilter({
			...initialFilter,
			filter: { product_name: val },
		})
	}
	return (
		<div
			className='content d-flex flex-column flex-column-fluid'
			id='kt_content'
		>
			{/*begin::Entry*/}
			<div className='d-flex flex-column-fluid'>
				{/*begin::Container*/}
				<div className='container'>
					{/*begin::Page Layout*/}
					<div className='d-flex flex-row'>
						{/*begin::Aside*/}
						<div
							className='flex-column offcanvas-mobile w-300px w-xl-325px'
							id='kt_profile_aside'
						>
							{/*begin::Forms Widget 13*/}
							<div className='card card-custom gutter-b'>
								<div className='card-header border-0 pt-5'>
									<h3 className='card-title align-items-start flex-column mb-3'>
										<span className='card-label font-size-h3 font-weight-bolder text-dark'>
											{formik.values.id ? 'Edit Product' : 'Add New Product'}
										</span>
									</h3>
								</div>
								{/*begin::Body*/}
								<div className='card-body pt-4'>
									{/*begin::Form*/}
									<form onSubmit={formik.handleSubmit}>
										{/*begin::Product info*/}
										<div className='mt-6'>
											<div className='text-muted mb-4 font-weight-bolder font-size-lg'>
												Product Info
											</div>
											{/*begin::Input*/}
											<div className='form-group mb-8'>
												<label className='font-weight-bolder'>Name</label>
												<input
													type='text'
													className={`form-control form-control-solid form-control-lg ${getInputClasses(
														'product_name',
													)}`}
													placeholder=''
													{...formik.getFieldProps('product_name')}
												/>
												{formik.touched.product_name &&
												formik.errors.product_name ? (
													<div className='invalid-feedback'>
														{formik.errors.product_name}
													</div>
												) : null}
											</div>
											<div className='form-group mb-8'>
												<label className='font-weight-bolder'>Category</label>
												<select
													className={`form-control form-control-solid form-control-lg ${getInputClasses(
														'product_category',
													)}`}
													{...formik.getFieldProps('product_category')}
												>
													<option></option>
													<option>Mens</option>
													<option>Womens</option>
													<option>Accessories</option>
													<option>Technology</option>
													<option>Appliances</option>
												</select>
												{formik.touched.product_category &&
												formik.errors.product_category ? (
													<div className='invalid-feedback'>
														{formik.errors.product_category}
													</div>
												) : null}
											</div>
											<div className='form-group mb-8'>
												<label
													htmlFor='exampleTextarea'
													className='font-weight-bolder'
												>
													Description
												</label>
												<textarea
													className={`form-control form-control-solid form-control-lg ${getInputClasses(
														'product_description',
													)}`}
													rows='3'
													{...formik.getFieldProps('product_description')}
												></textarea>
												{formik.touched.product_description &&
												formik.errors.product_description ? (
													<div className='invalid-feedback'>
														{formik.errors.product_description}
													</div>
												) : null}
											</div>
											<Accordion defaultActiveKey={0} className='mb-2'>
												{[...Array(variety)].map((el, index) => (
													<Card key={index}>
														<Accordion.Toggle as={Card.Header} eventKey={index}>
															Option {index + 1}
														</Accordion.Toggle>
														<Accordion.Collapse eventKey={index}>
															<Card.Body>
																<div className='form-group'>
																	<label className='font-weight-bolder'>
																		Price (NGN)
																	</label>
																	<input
																		type='number'
																		className={`form-control form-control-solid form-control-lg ${getInputClasses(
																			`product_varieties[${index}][price]`,
																		)}`}
																		placeholder=''
																		{...formik.getFieldProps(
																			`product_varieties[${index}][price]`,
																		)}
																	/>
																	{formik.touched[
																		`product_varieties[${index}][price]`
																	] &&
																	formik.errors[
																		`product_varieties[${index}][price]`
																	] ? (
																		<div className='invalid-feedback'>
																			{
																				formik.errors[
																					`product_varieties[${index}][price]`
																				]
																			}
																		</div>
																	) : null}
																</div>
																<div className='form-group'>
																	<label className='font-weight-bolder'>
																		Qantity
																	</label>
																	<input
																		type='number'
																		className={`form-control form-control-solid form-control-lg ${getInputClasses(
																			`product_varieties[${index}][quantity]`,
																		)}`}
																		placeholder=''
																		{...formik.getFieldProps(
																			`product_varieties[${index}][quantity]`,
																		)}
																	/>
																	{formik.touched[
																		`product_varieties[${index}][quantity]`
																	] &&
																	formik.errors[
																		`product_varieties[${index}][quantity]`
																	] ? (
																		<div className='invalid-feedback'>
																			{
																				formik.errors[
																					`product_varieties[${index}][quantity]`
																				]
																			}
																		</div>
																	) : null}
																</div>
																<div className='form-group mb-8'>
																	<label className='font-weight-bolder'>
																		Size
																	</label>
																	<select
																		className={`form-control form-control-solid form-control-lg ${getInputClasses(
																			`product_varieties[${index}][size]`,
																		)}`}
																		{...formik.getFieldProps(
																			`product_varieties[${index}][size]`,
																		)}
																	>
																		<option></option>
																		<option>XS</option>
																		<option>S</option>
																		<option>M</option>
																		<option>L</option>
																		<option>XL</option>
																	</select>
																	{formik.touched[
																		`product_varieties[${index}][size]`
																	] &&
																	formik.errors[
																		`product_varieties[${index}][size]`
																	] ? (
																		<div className='invalid-feedback'>
																			{
																				formik.errors[
																					`product_varieties[${index}][size]`
																				]
																			}
																		</div>
																	) : null}
																</div>
																{/*begin::Color*/}
																<div className='form-group'>
																	<label className='font-weight-bolder'>
																		Color
																	</label>
																	<div className='radio-inline mb-11'>
																		{colors.map((c) => (
																			<label
																				key={c}
																				className={`radio radio-accent radio-${c} mr-0`}
																			>
																				<input
																					type='radio'
																					name={`product_varieties[${index}][color]`}
																					value={c}
																					onChange={formik.handleChange}
																				/>
																				<span></span>
																			</label>
																		))}
																	</div>
																	{formik.touched[
																		`product_varieties[${index}][color]`
																	] &&
																	formik.errors[
																		`product_varieties[${index}][color]`
																	] ? (
																		<div className='invalid-feedback'>
																			{
																				formik.errors[
																					`product_varieties[${index}][color]`
																				]
																			}
																		</div>
																	) : null}
																</div>
																{/*end::Color*/}
															</Card.Body>
														</Accordion.Collapse>
													</Card>
												))}
											</Accordion>
											<div className='d-flex justify-content-between align-items-center mb-7'>
												<div className='font-weight-bolder text-dark font-size-h3 mb-0'></div>
												<button
													onClick={() => setVariety(variety + 1)}
													type='button'
													className='btn btn-light-primary btn-sm font-weight-bolder'
												>
													Add more...
												</button>
											</div>
											<button
												type='submit'
												className='btn btn-primary font-weight-bolder mr-2 px-8'
											>
												Save
												{loading && (
													<span className='ml-3 spinner spinner-white'></span>
												)}
											</button>
											<button
												type='reset'
												className='btn btn-clear font-weight-bolder text-muted px-8'
											>
												Discard
											</button>
											{/*end::Input*/}
										</div>
										{/*end::Product info*/}
									</form>
									{/*end::Form*/}
								</div>
								{/*end::Body*/}
							</div>
							{/*end::Forms Widget 13*/}
						</div>
						{/*end::Aside*/}
						{/*begin::Layout*/}
						<div className='flex-row-fluid ml-lg-8'>
							{/*begin::Card*/}
							<div className='card card-custom card-stretch gutter-b'>
								<div className='card-body'>
									{/*begin::Engage Widget 15*/}
									<div className='card card-custom mb-12'>
										<div
											className='card-body rounded p-0 d-flex'
											style={{ backgroundColor: '#DAF0FD' }}
										>
											<div className='d-flex flex-column flex-lg-row-auto w-auto w-lg-350px w-xl-450px w-xxl-500px p-10 p-md-20'>
												<h1 className='font-weight-bolder text-dark'>
													Search Goods
												</h1>
												<div className='font-size-h4 mb-8'>
													Get Amazing Gadgets
												</div>
												{/*begin::Form*/}
												<form className='d-flex flex-center py-2 px-6 bg-white rounded'>
													<span className='svg-icon svg-icon-lg svg-icon-primary'>
														{/*begin::Svg Icon | path:assets/media/svg/icons/General/Search.svg*/}
														<SVG
															src={toAbsoluteUrl(
																'/media/svg/icons/General/Search.svg',
															)}
														/>
														{/*end::Svg Icon*/}
													</span>
													<input
														type='text'
														className='form-control border-0 font-weight-bold pl-2'
														placeholder='Search Goods'
														onChange={(e) => searchText(e.target.value)}
													/>
												</form>
												{/*end::Form*/}
											</div>
											<div
												className='d-none d-md-flex flex-row-fluid bgi-no-repeat bgi-position-y-center bgi-position-x-left bgi-size-cover'
												style={{
													backgroundImage:
														'url(/media/svg/illustrations/progress.svg)',
												}}
											></div>
										</div>
									</div>
									{/*end::Engage Widget 15*/}
									{/*begin::Section*/}
									{categories.map((c) => (
										<div className='mb-11' key={c}>
											{/*begin::Heading*/}
											<div className='d-flex justify-content-between align-items-center mb-7'>
												<h2 className='font-weight-bolder text-dark font-size-h3 mb-0'>
													{c}
												</h2>
												{/* <a
													href='#'
													className='btn btn-light-primary btn-sm font-weight-bolder'
												>
													View All
												</a> */}
											</div>
											{/*end::Heading*/}
											{/*begin::Products*/}
											<div className='row'>
												{/*begin::Product*/}
												{entities.map(
													(e) =>
														e.product_category === c && (
															<div
																className='col-md-4 col-xxl-4 col-lg-12'
																key={e.id}
															>
																{/*begin::Card*/}
																<div className='card card-custom card-shadowless'>
																	<div className='card-body p-0'>
																		{/*begin::Image*/}
																		<div className='overlay'>
																			<div className='overlay-wrapper rounded bg-light text-center'>
																				<img
																					src='/media/products/1.png'
																					alt=''
																					className='mw-100 w-200px'
																				/>
																			</div>
																			<div className='overlay-layer'>
																				<button
																					type='button'
																					className='btn font-weight-bolder btn-sm btn-success mr-2'
																				>
																					<i className='flaticon-eye icon-lg'></i>
																				</button>
																				<button
																					type='button'
																					className='btn font-weight-bolder btn-sm btn-primary mr-2'
																					onClick={() => updateAProduct(e.id)}
																				>
																					<i className='flaticon2-edit icon-lg'></i>
																				</button>
																				<button
																					type='button'
																					className='btn font-weight-bolder btn-sm btn-danger'
																					onClick={() => deleteAProduct(e.id)}
																				>
																					<i className='flaticon-delete-1 icon-lg'></i>
																				</button>
																			</div>
																		</div>
																		{/*end::Image*/}
																		{/*begin::Details*/}
																		<div className='text-center mt-5 mb-md-0 mb-lg-5 mb-md-0 mb-lg-5 mb-lg-0 mb-5 d-flex flex-column'>
																			<span className='font-size-h5 font-weight-bolder text-dark-75 text-hover-primary mb-1'>
																				{e.product_name}
																			</span>
																			<span className='font-size-lg'>
																				NGN{' '}
																				{Math.min(
																					...e.product_varieties.map((p) => {
																						return p.price
																					}),
																				).toFixed(2)}
																				{e.product_varieties.length > 1 &&
																					' - ' +
																						Math.max(
																							...e.product_varieties.map(
																								(p) => {
																									return p.price
																								},
																							),
																						).toFixed(2)}
																			</span>
																		</div>
																		{/*end::Details*/}
																	</div>
																</div>
																{/*end::Card*/}
															</div>
														),
												)}
												{/*end::Product*/}
											</div>
											{/*end::Products*/}
										</div>
									))}
									{/*end::Section*/}
								</div>
							</div>
							{/*end::Card*/}
						</div>
						{/*end::Layout*/}
					</div>
					{/*end::Page Layout*/}
				</div>
				{/*end::Container*/}
			</div>
			{/*end::Entry*/}
		</div>
	)
}
